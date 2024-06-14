getLoans()

resultTitle = document.getElementById('processResultModalTitle');
resultBody = document.getElementById('processResultModalBody');

async function getLoans() {
    document.getElementById('getAllLoanBtn').innerText = 'โหลดข้อมูลใหม่'
    document.getElementById('getAllLoanBtn').classList.remove('btn-info')
    document.getElementById('getAllLoanBtn').classList.add('btn-dark')
    document.getElementById('outputContainer').innerHTML = `
        <div id="loader" class="pb-4 card-bg rounded-corner blur text-center animate__animated animate__bounceIn">
            <div class="loader animate__animated animate__infinite">
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
                <span class="stroke"></span>
            </div>
        </div>
    `
    await fetch('http://127.0.0.1:8080/loans', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.length != 0) {
                document.getElementById('outputContainer').innerHTML = `
                <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__fadeInUp'>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#createLoanModal">
                            เพิ่มข้อมูลลูกค้า
                        </button>
                    </div>
                    <hr>
                    <div class="ovf-scroll">
                        <table class="text-start">
                            <tbody id="outputTable">
                                <th class='text-center'>ID</th>
                                <th>ชื่อผู้กู้ยืม</th>
                                <th>จำนวนเงินกู้</th>
                                <th>อัตราดอกเบี้ย</th>
                                <th>วันที่กู้</th>
                                <th>วันสิ้นสุด</th>
                                <th class="text-center prevent-select">ดำเนินการ</th>
                            </tbody>
                        </table>
                    </div>
                </div>`
                for (i = 0; i < data.length; i++) {
                    document.getElementById('outputTable').innerHTML += `
                    <tr id="loanId${data[i].ID}">
                        <td class='text-center'>${data[i].ID}</td>
                        <td id='loanOwner${data[i].ID}'>
                            <a class='linkText' onclick="window.location.replace('customers.html?q=${data[i].Customer.IdCardNumber}')">${data[i].Customer.Name}</a>
                        </td>
                        <td id='loanAmount${data[i].ID}'>${data[i].Amount}</td>
                        <td id='loanInterest${data[i].ID}'>${data[i].LoanInterest}</td>
                        <td id='loanStartDate${data[i].ID}'>${data[i].StartDate}</td>
                        <td id='loanDueDate${data[i].ID}'>${data[i].DueDate}</td>
                        <td class="text-center table-btn prevent-select">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateLoanModal" id="loanUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Amount}', '${data[i].LoanInterest}', '${data[i].StartDate}', '${data[i].DueDate}')">แก้ไข</button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLoanModal" id="loanDelete${data[i].ID}" onclick="confirmDeleteLoan(${data[i].ID}, '${data[i].Amount}')">ลบ</button>
                        </td>
                    </tr>`;
                }
            } else {
                document.getElementById('outputContainer').innerHTML = `
                <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn'>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#createLoanModal">
                            เพิ่มข้อมูลลูกค้า
                        </button>
                    </div>
                    <hr>
                    ไม่พบข้อมูล
                </div>`
            }
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

function openUpdateModal(id, name, address, tel, email) {
    document.getElementById('updateLoanIdInput').value = id
    document.getElementById('updateLoanNameInput').value = name
    document.getElementById('updateLoanAddressInput').value = address
    document.getElementById('updateLoanTelInput').value = tel
    document.getElementById('updateLoanEmailInput').value = email
}

async function updateLoanInfo() {
    const loanId = document.getElementById('updateLoanIdInput').value;
    const loanAmount = document.getElementById('updateLoanNameInput').value;
    const loanInterest = document.getElementById('updateLoanAddressInput').value;
    const loanStartDate = document.getElementById('updateLoanTelInput').value;
    const loanDueDate = document.getElementById('updateLoanEmailInput').value;

    const saveBtn = document.getElementById('updateLoanBtn');
    const cancleBtn = document.getElementById('updateLoanCancleBtn');

    const loanInfo = {
        Name: loanAmount,
        Address: loanInterest,
        Tel: loanStartDate,
        Email: loanDueDate
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
            document.getElementById(`loanUpdate${loanId}`).setAttribute('onclick', `openUpdateModal(${loanId}, '${loanAmount}', '${loanInterest}', '${loanStartDate}', '${loanDueDate}')`)
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

function confirmDeleteLoan(id, name) {
    document.getElementById('deleteModalContent').innerHTML = `คุณต้องการลบข้อมูลของคุณ <b>${name}</b> ใช่หรือไม่`
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

async function createLoanInfo() {
    const loanAmount = document.getElementById('createLoanNameInput').value;
    const loanInterest = document.getElementById('createLoanAddressInput').value;
    const loanStartDate = document.getElementById('createLoanTelInput').value;
    const loanDueDate = document.getElementById('createLoanEmailInput').value;

    const saveBtn = document.getElementById('createLoanBtn').value;
    const cancleBtn = document.getElementById('createLoanCancleBtn').value;

    const loanInfo = {
        Name: loanAmount,
        Address: loanInterest,
        Tel: loanStartDate,
        Email: loanDueDate
    };

    saveBtn.disabled = true
    cancleBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loanInfo)
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> เพิ่มข้อมูลสำเร็จ`
            resultBody.innerHTML = `เพิ่มข้อมูลแล้ว`
            $("#createLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            document.getElementById('createLoanNameInput').value = null;
            document.getElementById('createLoanAddressInput').value = null;
            document.getElementById('createLoanTelInput').value = null;
            document.getElementById('createLoanEmailInput').value = null;
            saveBtn.disabled = false
            cancleBtn.disabled = false
            getLoans()
        } else {
            console.error('Failed to update loan info:', response.status);
            console.error(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#createLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#createLoanModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
}

async function searchLoan() {
    const searchBtn = document.getElementById('searchBtn')
    const tel = document.getElementById('searchText').value

    searchBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/loans/search/${tel}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            document.getElementById('getAllLoanBtn').classList.remove('btn-dark')
            document.getElementById('getAllLoanBtn').classList.add('btn-info')
            document.getElementById('getAllLoanBtn').innerText = 'ข้อมูลลูกค้าทั้งหมด'
            if (data.length != 0) {
                document.getElementById('outputContainer').innerHTML = `
                <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__fadeInUp'>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#createLoanModal">
                            เพิ่มข้อมูลลูกค้า
                        </button>
                    </div>
                    <hr>
                    <div class="ovf-scroll">
                        <table class="text-start">
                            <tbody id="outputTable">
                                <th class='text-center'>ID</th>
                                <th>ชื่อ</th>
                                <th class='table-address'>ที่อยู่</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>อีเมล</th>
                                <th class="text-center prevent-select">ดำเนินการ</th>
                            </tbody>
                        </table>
                    </div>
                </div>`
                for (i = 0; i < data.length; i++) {
                    document.getElementById('outputTable').innerHTML += `
                    <tr id="loanId${data[i].ID}">
                        <td class='text-center'>${data[i].ID}</td>
                        <td id='loanAmount${data[i].ID}'>${data[i].Amount}</td>
                        <td id='loanInterest${data[i].ID}'>${data[i].LoanInterest}</td>
                        <td id='loanStartDate${data[i].ID}'>${data[i].StartDate}</td>
                        <td id='loanDueDate${data[i].ID}'>${data[i].DueDate}</td>
                        <td class="text-center table-btn prevent-select">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateLoanModal" id="loanUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Amount}', '${data[i].LoanInterest}', '${data[i].StartDate}', '${data[i].DueDate}')">แก้ไข</button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteLoanModal" id="loanDelete${data[i].ID}" onclick="confirmDeleteLoan(${data[i].ID}, '${data[i].Amount}')">ลบ</button>
                        </td>
                    </tr>`;
                }
            } else {
                document.getElementById('outputContainer').innerHTML = `
                <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn'>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#createLoanModal">
                            เพิ่มข้อมูลลูกค้า
                        </button>
                    </div>
                    <hr>
                    ไม่พบข้อมูล
                </div>`
            }
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