const params = new URLSearchParams(window.location.search);
if (params.get('q') != null) {
    document.getElementById('searchText').value = params.get('q')
    searchPayments()
} else {
    getPayments()
}

resultTitle = document.getElementById('processResultModalTitle');
resultBody = document.getElementById('processResultModalBody');

function displayPayment(data, isSearch = false) {
    if (data.length != 0) {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__fadeInUp'>
            <div class="ovf-scroll">
                <table class="text-start">
                    <tbody id="outputTable">
                        <th class='text-center'>รหัสกาารชำระเงิน</th>
                        <th class='text-center'>รหัสเงินกู้</th>
                        <th>ชื่อผู้กู้ยืม</th>
                        <th class='text-end'>จำนวนเงิน</th>
                        <th class='text-center'>วันที่ชำระเงิน</th>
                        <th class="text-center prevent-select">ดำเนินการ</th>
                    </tbody>
                </table>
            </div>
        </div>`
        for (i = 0; i < data.length; i++) {
            document.getElementById('outputTable').innerHTML += `
            <tr id="paymentId${data[i].ID}">
                <td class='text-center'>${data[i].ID}</td>
                <td id='paymentLoanId${data[i].ID}' class='text-center'>
                    <a class='linkText' onclick="window.location.replace('loans.html?id=${data[i].Loan.ID}')">${data[i].Loan.ID}</a>
                </td>
                <td id='paymentUserName${data[i].ID}'>
                    <a class='linkText' onclick="window.location.replace('customers.html?q=${data[i].Loan.Customer.IdCardNumber}')">${data[i].Loan.Customer.Name}</a>
                </td>
                <td class='text-end' id='paymentAmount${data[i].ID}'>${currencyFormatter.format(data[i].Amount)}</td>
                <td id='paymentDate${data[i].ID}' class='text-center'>${convertDate(data[i].Date)}</td>
                <td class="text-center table-btn prevent-select">
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deletePaymentModal" id="paymentDelete${data[i].ID}" onclick="confirmDeleteUser(${data[i].ID}, '${data[i].Amount}')">ลบ</button>
            </tr>`;
        }
    } else {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn'>
            ไม่มีข้อมูล
        </div>`
    }
}


async function getPayments() {
    document.getElementById('searchText').value = null
    document.getElementById('getAllPaymentBtn').innerText = 'โหลดข้อมูลใหม่'
    document.getElementById('getAllPaymentBtn').classList.remove('btn-info')
    document.getElementById('getAllPaymentBtn').classList.add('btn-dark')
    document.getElementById('outputContainer').innerHTML = `
        <div id="loader" class="py-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn">
            <div class="loader animate__animated animate__infinite">
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
            </div>
            <b>กำลังเชื่อมต่อฐานข้อมูล</b>
        </div>
    `
    await fetch('http://127.0.0.1:8080/payments', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            displayPayment(data)
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('outputContainer').innerHTML = `
            <div class="p-4 card-bg rounded-corner blur text-center animate__animated animate__bounceIn prevent-all">
                <i class="fa-solid fa-triangle-exclamation fa-2xl text-danger"></i><br><br>
                <b>ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้</b>
            </div>
            `
        });
}

async function searchPayments() {
    const searchBtn = document.getElementById('searchBtn')
    const loanId = document.getElementById('searchText').value

    searchBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/payments/search/${loanId}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            document.getElementById('getAllPaymentBtn').classList.remove('btn-dark')
            document.getElementById('getAllPaymentBtn').classList.add('btn-info')
            document.getElementById('getAllPaymentBtn').innerHTML = 'กำลังแสดงผลการค้นหา <b><u>คลิกที่นี่</u></b> เพื่อแสดงข้อมูลลูกค้าทั้งหมด'
            displayPayment(data, true)
            searchBtn.disabled = false
        } else {
            console.error('Failed to update user info:', response.status);
            console.error(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ค้นหาข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#processResultModal").modal("show");
            searchBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ค้นหาข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#processResultModal").modal("show");
        searchBtn.disabled = false
    }
}

function confirmDeleteUser(id, amount) {
    document.getElementById('deleteModalContent').innerHTML = `คุณต้องการลบข้อมูลการชำระเงิน รหัสการชำระเงิน <b>${id}</b> จำนวนเงิน <b>${currencyFormatter.format(amount)}</b> ใช่หรือไม่`
    document.getElementById('confirmDeleteBtn').setAttribute("onclick", `deletePayment(${id})`);
}

async function deletePayment(id) {
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const cancleBtn = document.getElementById('confirmDeleteCancleBtn');
    deleteBtn.disabled = true
    cancleBtn.disabled = true
    try {

        const response = await fetch(`http://127.0.0.1:8080/payments/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            document.getElementById(`paymentId${id}`).remove()
            deleteBtn.disabled = false
            cancleBtn.disabled = false
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> ลบข้อมูลสำเร็จ`
            resultBody.innerHTML = `ลบข้อมูลแล้ว`
            $("#deletePaymentModal").modal("hide");
            $("#processResultModal").modal("show");
        } else {
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#deletePaymentModal").modal("hide");
            $("#processResultModal").modal("show");
            deleteBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#deletePaymentModal").modal("hide");
        $("#processResultModal").modal("show");
        deleteBtn.disabled = false
        cancleBtn.disabled = false
    }
}