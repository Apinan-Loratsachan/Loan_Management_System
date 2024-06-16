const params = new URLSearchParams(window.location.search);
if (params.get('q') != null) {
    document.getElementById('searchText').value = params.get('q')
    searchUser()
} else {
    getCustomers()
}

resultTitle = document.getElementById('processResultModalTitle');
resultBody = document.getElementById('processResultModalBody');

function displayCustomers(data, isSearch = false) {
    if (data.length != 0) {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__fadeInUp'>
            <div class="d-grid gap-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#createUserModal">
                    เพิ่มข้อมูลลูกค้า
                </button>
            </div>
            <hr>
            <div class="ovf-scroll">
                <table class="text-start">
                    <tbody id="outputTable">
                        <th class='text-center'>รหัสลูกค้า</th>
                        <th>ชื่อ</th>
                        ${!isSearch ? `<th>เลขประจำตัวประชาชน</th>` : ``}
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
            <tr id="customerId${data[i].ID}">
                <td class='text-center'>${data[i].ID}</td>
                <td id='userName${data[i].ID}'>${data[i].Name}</td>
                ${!isSearch ? `<td id='userIdCard${data[i].ID}'>${data[i].IdCardNumber}</td>` : ``}
                <td id='userAddress${data[i].ID}'>${data[i].Address}</td>
                <td id='userTel${data[i].ID}'>${data[i].Tel}</td>
                <td id='userEmail${data[i].ID}'>${data[i].Email}</td>
                <td class="text-center table-btn prevent-select">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="userUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Name}', ${data[i].IdCardNumber}, '${data[i].Address}', '${data[i].Tel}', '${data[i].Email}')">แก้ไข</button>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createLoanModal" onclick="openCreateLoanModal(${data[i].ID}, '${data[i].Name}', ${data[i].IdCardNumber})">เพิ่มเงินกู้</button>
                    <button type="button" class="btn btn-primary" onclick="window.location.replace('loans.html?q=${data[i].IdCardNumber}')">เงินกู้</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" id="userDelete${data[i].ID}" onclick="confirmDeleteUser(${data[i].ID}, '${data[i].Name}')">ลบ</button>
            </tr>`;
        }
    } else {
        document.getElementById('outputContainer').innerHTML = `
        <div class='p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn'>
            <div class="d-grid gap-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#createUserModal">
                    เพิ่มข้อมูลลูกค้า
                </button>
            </div>
            <hr>
            ไม่มีข้อมูล
        </div>`
    }
}


async function getCustomers() {
    document.getElementById('searchText').value = null
    document.getElementById('getAllUserBtn').innerText = 'โหลดข้อมูลใหม่'
    document.getElementById('getAllUserBtn').classList.remove('btn-info')
    document.getElementById('getAllUserBtn').classList.add('btn-dark')
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
    await fetch('http://127.0.0.1:8080/customers', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            displayCustomers(data)
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

function openUpdateModal(id, name, idCard, address, tel, email) {
    document.getElementById('updateUserIdInput').value = id
    document.getElementById('updateUserNameInput').value = name
    document.getElementById('updateUserIdCardInput').value = idCard
    document.getElementById('updateUserAddressInput').value = address
    document.getElementById('updateUserTelInput').value = tel
    document.getElementById('updateUserEmailInput').value = email
}

async function updateUserInfo() {
    const userId = document.getElementById('updateUserIdInput').value;
    const userName = document.getElementById('updateUserNameInput').value;
    const userIdCard = document.getElementById('updateUserIdCardInput').value;
    const userAddress = document.getElementById('updateUserAddressInput').value;
    const userTel = document.getElementById('updateUserTelInput').value;
    const userEmail = document.getElementById('updateUserEmailInput').value;

    const saveBtn = document.getElementById('updateUserBtn');
    const cancleBtn = document.getElementById('updateUserCancleBtn');

    const userInfo = {
        Name: userName,
        IdCardNumber: parseInt(userIdCard),
        Address: userAddress,
        Tel: userTel,
        Email: userEmail
    };

    saveBtn.disabled = true
    cancleBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            if (data.success) {
                document.getElementById(`userName${userId}`).innerText = userName
                document.getElementById(`userIdCard${userId}`).innerText = userIdCard
                document.getElementById(`userAddress${userId}`).innerText = userAddress
                document.getElementById(`userTel${userId}`).innerText = userTel
                document.getElementById(`userEmail${userId}`).innerText = userEmail
                document.getElementById(`userUpdate${userId}`).setAttribute('onclick', `openUpdateModal(${userId}, '${userName}', ${userIdCard}, '${userAddress}', '${userTel}', '${userEmail}')`)
                document.getElementById(`userDelete${userId}`).setAttribute('onclick', `confirmDeleteUser(${userId}, '${userName}')`)
                resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> บันทึกข้อมูลสำเร็จ`
                resultBody.innerHTML = `บันทึกการเปลี่ยนแปลงข้อมูลแล้ว`
                $("#updateUserModal").modal("hide");
                $("#processResultModal").modal("show");
                saveBtn.disabled = false
                cancleBtn.disabled = false
            } else {
                resultTitle.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #FFD43B;"></i> บันทึกข้อมูลไม่สำเร็จ`
                resultBody.innerHTML = `เลขประจำตัวประชาชนนี้มีอยู่ในระบบแล้ว`
                $("#updateUserModal").modal("hide");
                $("#processResultModal").modal("show");
                document.getElementById('createUserNameInput').value = null;
                document.getElementById('createUserAddressInput').value = null;
                document.getElementById('createUserTelInput').value = null;
                document.getElementById('createUserEmailInput').value = null;
                saveBtn.disabled = false
                cancleBtn.disabled = false
            }
        } else {
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> บันทึกข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#updateUserModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
            console.error('Failed to update user info:', response.status);
            console.error(data);
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> บันทึกข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#updateUserModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
}

function confirmDeleteUser(id, name) {
    document.getElementById('deleteModalContent').innerHTML = `คุณต้องการลบข้อมูลของคุณ <b>${name}</b> ใช่หรือไม่`
    document.getElementById('confirmDeleteBtn').setAttribute("onclick", `deleteUser(${id})`);
}

async function deleteUser(id) {
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const cancleBtn = document.getElementById('confirmDeleteCancleBtn');
    deleteBtn.disabled = true
    cancleBtn.disabled = true
    try {

        const response = await fetch(`http://127.0.0.1:8080/customers/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            document.getElementById(`customerId${id}`).remove()
            deleteBtn.disabled = false
            cancleBtn.disabled = false
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> ลบข้อมูลสำเร็จ`
            resultBody.innerHTML = `ลบข้อมูลแล้ว`
            $("#deleteUserModal").modal("hide");
            $("#processResultModal").modal("show");
        } else {
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#deleteUserModal").modal("hide");
            $("#processResultModal").modal("show");
            deleteBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ลบข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#deleteUserModal").modal("hide");
        $("#processResultModal").modal("show");
        deleteBtn.disabled = false
        cancleBtn.disabled = false
    }
}

async function createUserInfo() {
    const userName = document.getElementById('createUserNameInput').value;
    const idCard = document.getElementById('createUserIdCardInput').value;
    const userAddress = document.getElementById('createUserAddressInput').value;
    const userTel = document.getElementById('createUserTelInput').value;
    const userEmail = document.getElementById('createUserEmailInput').value;

    const saveBtn = document.getElementById('createUserBtn').value;
    const cancleBtn = document.getElementById('createUserCancleBtn').value;

    const userInfo = {
        IdCardNumber: parseInt(idCard),
        Name: userName,
        Address: userAddress,
        Tel: userTel,
        Email: userEmail
    };

    saveBtn.disabled = true
    cancleBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            if (data.success) {
                resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> เพิ่มข้อมูลสำเร็จ`
                resultBody.innerHTML = `เพิ่มข้อมูลแล้ว`
                $("#createUserModal").modal("hide");
                $("#processResultModal").modal("show");
                document.getElementById('createUserNameInput').value = null;
                document.getElementById('createUserAddressInput').value = null;
                document.getElementById('createUserTelInput').value = null;
                document.getElementById('createUserEmailInput').value = null;
                saveBtn.disabled = false
                cancleBtn.disabled = false
                getCustomers()
            } else {
                resultTitle.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #FFD43B;"></i> เพิ่มข้อมูลไม่สำเร็จ`
                resultBody.innerHTML = `เลขประจำตัวประชาชนนี้มีอยู่ในระบบแล้ว`
                $("#createUserModal").modal("hide");
                $("#processResultModal").modal("show");
                document.getElementById('createUserNameInput').value = null;
                document.getElementById('createUserAddressInput').value = null;
                document.getElementById('createUserTelInput').value = null;
                document.getElementById('createUserEmailInput').value = null;
                saveBtn.disabled = false
                cancleBtn.disabled = false
            }
        } else {
            console.error('Failed to update user info:', response.status);
            console.error(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#createUserModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#createUserModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
}

async function searchUser() {
    const searchBtn = document.getElementById('searchBtn')
    const idCard = document.getElementById('searchText').value

    searchBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/customers/search/${idCard}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            document.getElementById('getAllUserBtn').classList.remove('btn-dark')
            document.getElementById('getAllUserBtn').classList.add('btn-info')
            document.getElementById('getAllUserBtn').innerHTML = 'กำลังแสดงผลการค้นหา <b><u>คลิกที่นี่</u></b> เพื่อแสดงข้อมูลลูกค้าทั้งหมด'
            displayCustomers(data, true)
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

function openCreateLoanModal(id, name, idCard) {
    document.getElementById('createLoanUserId').value = id
    document.getElementById('createLoanUserName').value = name
    document.getElementById('createLoanUserIdCard').value = idCard
}

async function createLoan() {
    const id = document.getElementById('createLoanUserId').value
    const amount = document.getElementById('createLoanAmountInput').value
    const interest = document.getElementById('createLoanInterestInput').value
    const startDate = document.getElementById('createLoanStartDateInput').value
    const dueDate = document.getElementById('createLoanDueDateInput').value

    const saveBtn = document.getElementById('createLoanBtn').value;
    const cancleBtn = document.getElementById('createLoanCancleBtn').value;

    const loanInfo = {
        Amount: parseFloat(amount),
        LoanInterest: parseFloat(interest),
        StartDate: startDate + "T00:00:00Z",
        DueDate: dueDate + "T00:00:00Z",
        CustomerID: parseInt(id)
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
            resultBody.innerHTML = `เพิ่มข้อมูลเงินกู้แล้วครวสอบข้อมูลได้ที่แถบ<b>เงินกู้</b>`
            $("#createLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            document.getElementById('createLoanAmountInput').value = null;
            document.getElementById('createLoanInterestInput').value = null;
            document.getElementById('createLoanStartDateInput').value = null;
            document.getElementById('createLoanDueDateInput').value = null;
            saveBtn.disabled = false
            cancleBtn.disabled = false
        } else {
            console.error('Failed to update user info:', response.status);
            console.error(data);
            resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลเงินกู้ไม่สำเร็จ`
            resultBody.innerHTML = `ข้อผิดพลาด : ${data}`
            $("#createLoanModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
        }
    } catch (error) {
        console.error('Error:', error);
        resultTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> เพิ่มข้อมูลเงินกู้ไม่สำเร็จ`
        resultBody.innerHTML = `ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้`
        $("#createLoanModal").modal("hide");
        $("#processResultModal").modal("show");
        saveBtn.disabled = false
        cancleBtn.disabled = false
    }
}