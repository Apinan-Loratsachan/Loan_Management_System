var state = 1

const params = new URLSearchParams(window.location.search);
if (params.get('id') != null) {
    document.getElementById('rdoSearchId').checked = true
    searchTypeChange()
    document.getElementById('searchId').value = params.get('id')
    searchLoan()
} else if (params.get('q') != null) {
    searchTypeChange()
    document.getElementById('searchText').value = params.get('q')
    searchLoan()
} else {
    searchTypeChange()
    getLoans()
}

resultTitle = document.getElementById('processResultModalTitle');
resultBody = document.getElementById('processResultModalBody');

function displayLoans(data) {
    if (data.length != 0) {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__fadeInUp'>
            <div class="ovf-scroll">
                <table class="text-start">
                    <tbody id="outputTable">
                        <th class='text-center'>รหัสเงินกู้</th>
                        <th>ชื่อผู้กู้ยืม</th>
                        <th class='text-center'>วันที่กู้</th>
                        <th class='text-center'>วันสิ้นสุด</th>
                        <th class='text-end'>จำนวนเงินกู้</th>
                        <th class='text-center'>อัตราดอกเบี้ย</th>
                        <th class='text-center'>ยอดสุทธิ</th>
                        <th class='text-end'>ยอดชำระ</th>
                        <th class='text-end'>ยอดค้างชำระ</th>
                        <th class='text-center'>สถานะ</th>
                        <th class="text-center prevent-select">ดำเนินการ</th>
                    </tbody>
                </table>
            </div>
        </div>`
        for (i = 0; i < data.length; i++) {
            document.getElementById('outputTable').innerHTML += `
            <tr id="loanId${data[i].ID}">
                <td class='text-center'>
                <a class='linkText' onclick="window.location.replace('payments.html?q=${data[i].ID}')">${data[i].ID}</a>
                </td>
                <td id='loanOwner${data[i].ID}'>
                    <a class='linkText' onclick="window.location.replace('customers.html?q=${data[i].Customer.IdCardNumber}')">${data[i].Customer.Name}</a>
                </td>
                <td id='loanStartDate${data[i].ID}' class='text-center'>${convertDate(data[i].StartDate)}</td>
                <td id='loanDueDate${data[i].ID}' class='text-center'>${convertDate(data[i].DueDate)}</td>
                <td id='loanAmount${data[i].ID}' class='text-end'>${currencyFormatter.format(data[i].Amount)}</td>
                <td id='loanInterest${data[i].ID}' class='text-center'>${data[i].LoanInterest}%</td>
                <td id='loanFinalAmount${data[i].ID}' class='text-center'>${currencyFormatter.format(data[i].FinalAmount)}</td>
                <td id='loanTotalPay${data[i].ID}' class='text-end'>${currencyFormatter.format(data[i].TotalPayments)}</td>
                <td id='loanBalance${data[i].ID}' class='text-end'>${currencyFormatter.format(data[i].Balance)}</td>
                <td id='loanStatus${data[i].ID}' class='text-center'>${setLoanStatus(data[i].Status, data[i].DueDate)}</td>
                <td class="text-center table-btn prevent-select">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateLoanModal" id="loanUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, ${data[i].Amount}, ${data[i].LoanInterest}, '${data[i].StartDate.replaceAll('T00:00:00Z', '')}', '${data[i].DueDate.replaceAll('T00:00:00Z', '')}', ${data[i].Customer.ID}, '${data[i].Customer.Name}', ${data[i].Customer.IdCardNumber}, ${data[i].TotalPayments})">แก้ไข</button>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPaymentModal" id="paymentCreate${data[i].ID}" onclick="openCreatePaymentModal(${data[i].ID}, ${data[i].Customer.ID}, '${data[i].Customer.Name}', ${data[i].Customer.IdCardNumber}, ${data[i].Balance})">เพิ่มการชำระเงิน</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLoanModal" id="loanDelete${data[i].ID}" onclick="confirmDeleteLoan(${data[i].ID}, '${data[i].Customer.Name}', ${data[i].Amount}, ${data[i].LoanInterest}, '${data[i].StartDate.replaceAll('T00:00:00Z', '')}', '${data[i].DueDate.replaceAll('T00:00:00Z', '')}')">ลบ</button>
                </td>
            </tr>`;
            if (data[i].Status == 2) {
                const editBtn = document.getElementById(`loanUpdate${data[i].ID}`)
                const createPaymentBtn = document.getElementById(`paymentCreate${data[i].ID}`)
                editBtn.removeAttribute("onclick");
                editBtn.removeAttribute("data-bs-target");
                editBtn.removeAttribute("data-bs-toggle");
                editBtn.disabled = true
                editBtn.classList.remove('btn-primary')
                editBtn.classList.add('btn-secondary')

                createPaymentBtn.removeAttribute("onclick");
                createPaymentBtn.removeAttribute("data-bs-target");
                createPaymentBtn.removeAttribute("data-bs-toggle");
                createPaymentBtn.disabled = true
                createPaymentBtn.classList.remove('btn-primary')
                createPaymentBtn.classList.add('btn-secondary')
            }
        }
    } else {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn'>
            ไม่มีข้อมูล
        </div>`
    }
}

function openCreatePaymentModal(loanId, userId, name, idCard, balance) {
    document.getElementById('createPaymentLoanIdInput').value = loanId
    document.getElementById('createPaymentUserId').value = userId
    document.getElementById('createPaymentUserName').value = name
    document.getElementById('createPaymentUserIdCard').value = idCard
    document.getElementById('createPaymentAmountInput').setAttribute("max", balance)
    document.getElementById('createPaymentDateInput').valueAsDate = new Date();
}

async function createPayment() {
    const loanId = document.getElementById('createPaymentLoanIdInput').value
    const amount = document.getElementById('createPaymentAmountInput').value
    const date = document.getElementById('createPaymentDateInput').value

    const saveBtn = document.getElementById('createPaymentBtn').value;
    const cancleBtn = document.getElementById('createPaymentCancleBtn').value;

    const paymentInfo = {
        Amount: parseFloat(amount),
        Date: date + "T00:00:00Z",
        LoanID: parseInt(loanId)
    }

    try {
        const response = await fetch(`http://127.0.0.1:8080/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> เพิ่มข้อมูลสำเร็จ`
            resultBody.innerHTML = `เพิ่มข้อมูลการชำระเงินแล้วแล้วครวสอบข้อมูลได้ที่แถบ<b>การชำระเงิน</b>`
            $("#createPaymentModal").modal("hide");
            $("#processResultModal").modal("show");
            document.getElementById('createPaymentAmountInput').value = null;
            document.getElementById('createPaymentDateInput').value = null;
            saveBtn.disabled = false
            cancleBtn.disabled = false
            if (state == 1) {
                getLoans()
            } else if (state == 2) {
                searchLoan()
            } else {
                searchLoan(true)
            }
        } else {
            console.error('Failed to update user info:', response.status);
            console.error(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลการชำระเงินไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#createPaymentModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลการชำระเงินไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#createPaymentModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
    
}

async function getLoans() {
    state = 1
    document.getElementById('searchText').value = null
    document.getElementById('searchId').value = null
    document.getElementById('getAllLoanBtn').innerText = 'โหลดข้อมูลใหม่'
    document.getElementById('getAllLoanBtn').classList.remove('btn-info')
    document.getElementById('getAllLoanBtn').classList.add('btn-dark')
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
    await fetch('http://127.0.0.1:8080/loans', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            displayLoans(data)
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

function openUpdateModal(id, amount, interest, startDate, dueDate, uid, userName, idCardNumber, minAmount) {
    document.getElementById('updateLoanIdInput').value = id
    document.getElementById('updateLoanAmountInput').value = amount
    document.getElementById('updateLoanAmountInput').min = minAmount
    document.getElementById('updateLoanInterestInput').value = interest
    document.getElementById('updateLoanStartDateInput').value = startDate
    document.getElementById('updateLoanDueDateInput').value = dueDate
    document.getElementById('updateLoanUserId').value = uid
    document.getElementById('updateLoanUserName').value = userName
    document.getElementById('updateLoanUserIdCard').value = idCardNumber
}

async function updateLoanInfo() {
    const loanId = document.getElementById('updateLoanIdInput').value;
    const loanUserId = document.getElementById('updateLoanUserId').value;
    const loanUserName = document.getElementById('updateLoanUserName').value;
    const loanUserIdCard = document.getElementById('updateLoanUserIdCard').value;
    const loanAmount = document.getElementById('updateLoanAmountInput').value;
    const loanInterest = document.getElementById('updateLoanInterestInput').value;
    const loanStartDate = document.getElementById('updateLoanStartDateInput').value;
    const loanDueDate = document.getElementById('updateLoanDueDateInput').value;

    const saveBtn = document.getElementById('updateLoanBtn');
    const cancleBtn = document.getElementById('updateLoanCancleBtn');

    const loanInfo = {
        Amount: parseFloat(loanAmount),
        LoanInterest: parseFloat(loanInterest),
        StartDate: loanStartDate + "T00:00:00Z",
        DueDate: loanDueDate + "T00:00:00Z",
    };

    saveBtn.disabled = true
    cancleBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/loans/${loanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loanInfo)
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            document.getElementById(`loanAmount${loanId}`).innerText = loanAmount
            document.getElementById(`loanInterest${loanId}`).innerText = loanInterest
            document.getElementById(`loanStartDate${loanId}`).innerText = loanStartDate
            document.getElementById(`loanDueDate${loanId}`).innerText = loanDueDate
            document.getElementById(`loanStatus${loanId}`).innerHTML = setLoanStatus(1, loanDueDate)
            document.getElementById(`loanUpdate${loanId}`).setAttribute('onclick', `openUpdateModal(${loanId}, '${loanAmount}', '${loanInterest}', '${loanStartDate}', '${loanDueDate}', ${loanUserId}, '${loanUserName}', ${loanUserIdCard})`)
            document.getElementById(`loanDelete${loanId}`).setAttribute('onclick', `confirmDeleteLoan(${loanId}, '${loanAmount}')`)
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> บันทึกข้อมูลสำเร็จ`
            resultBody.innerHTML = `บันทึกการเปลี่ยนแปลงข้อมูลแล้ว`
            $("#updateLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
        } else {
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> บันทึกข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#updateLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
            console.error('Failed to update loan info:', response.status);
            console.error(data);
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> บันทึกข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#updateLoanModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
}

function confirmDeleteLoan(id, name, amount, interest, startDate, dueDate) {
    document.getElementById('deleteModalContent').innerHTML = `คุณต้องการลบข้อมูลเงินกู้ต่อไปนี้ :<br><br>รหัสเงินกู้ <b>${id}</b> ของคุณ <b>${name}</b><br>จำนวนเงิน <b>${currencyFormatter.format(amount)}</b> ดอกเบี้ย <b>${interest}%</b><br>กู้เงินวันที่ <b>${convertDate(startDate)}</b> ถึงวันที่ <b>${convertDate(dueDate)}</b><br><br>ใช่หรือไม่`
    document.getElementById('confirmDeleteBtn').setAttribute("onclick", `deleteLoan(${id})`);
}

async function deleteLoan(id) {
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const cancleBtn = document.getElementById('confirmDeleteCancleBtn');
    deleteBtn.disabled = true
    cancleBtn.disabled = true
    try {

        const response = await fetch(`http://127.0.0.1:8080/loans/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            document.getElementById(`loanId${id}`).remove()
            deleteBtn.disabled = false
            cancleBtn.disabled = false
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> ลบข้อมูลสำเร็จ`
            resultBody.innerHTML = `ลบข้อมูลแล้ว`
            $("#deleteLoanModal").modal("hide");
            $("#processResultModal").modal("show");
        } else {
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#deleteLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            deleteBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#deleteLoanModal").modal("hide");
        $("#processResultModal").modal("show");
        deleteBtn.disabled = false
        cancleBtn.disabled = false
    }
}

async function searchLoan() {
    const searchBtn = document.getElementById('searchBtn')
    const idCardNumber = document.getElementById('searchText').value
    const lid = document.getElementById('searchId').value

    searchBtn.disabled = true

    if (document.getElementById('rdoSearchId').checked) {
        state = 3
        try {
            const response = await fetch(`http://127.0.0.1:8080/loans/${lid}`, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.status === 200) {
                document.getElementById('getAllLoanBtn').classList.remove('btn-dark')
                document.getElementById('getAllLoanBtn').classList.add('btn-info')
                document.getElementById('getAllLoanBtn').innerHTML = `กำลังแสดงข้อมูลของรหัสเงินกู้ ${lid} <b><u>คลิกที่นี่</u></b> เพื่อแสดงข้อมูลเงินกู้ทั้งหมด`
                displayLoans(data)
                searchBtn.disabled = false
            } else {
                console.error('Failed to update loan info:', response.status);
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
    } else {
        state = 2
        try {
            const response = await fetch(`http://127.0.0.1:8080/loans/search/${idCardNumber}`, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.status === 200) {
                document.getElementById('getAllLoanBtn').classList.remove('btn-dark')
                document.getElementById('getAllLoanBtn').classList.add('btn-info')
                document.getElementById('getAllLoanBtn').innerHTML = 'กำลังแสดงผลการค้นหา <b><u>คลิกที่นี่</u></b> เพื่อแสดงข้อมูลเงินกู้ทั้งหมด'
                displayLoans(data)
                searchBtn.disabled = false
            } else {
                console.error('Failed to update loan info:', response.status);
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
}

function setLoanStatus(status, dueDate) {
    nowDate = new Date
    switch (status) {
        case 1: if (dueDate > nowDate.toISOString()) {
            return 'ค้างชำระ'
        } else {
            return '<div style="color: red;">เลยกำหนดชำระ</div>'
        }
        case 2: return '<div style="color: green;">ชำระแล้ว</div>'
        default: return status
    }
}

function searchTypeChange() {
    const idCardInput = document.getElementById('searchText')
    // const idCardRdo = document.getElementById('rdoSearchText')
    const lidInput = document.getElementById('searchId')
    const lidRdo = document.getElementById('rdoSearchId')

    if (lidRdo.checked) {
        lidInput.required = true
        idCardInput.required = false
        lidInput.disabled = false
        idCardInput.value = null
        idCardInput.disabled = true
    } else {
        idCardInput.required = true
        lidInput.required = false
        idCardInput.disabled = false
        lidInput.value = null
        lidInput.disabled = true
    }
}