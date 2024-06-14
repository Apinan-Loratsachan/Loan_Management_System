getCustomers()

const resultTitle = document.getElementById('processResultModalTitle');
const resultBody = document.getElementById('processResultModalBody');

async function getCustomers() {
    document.getElementById('getAllUserBtn').innerText = 'โหลดข้อมูลใหม่'
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
    await fetch('http://127.0.0.1:8080/customers', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
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
                <tr id="customerId${data[i].ID}">
                    <td class='text-center'>${data[i].ID}</td>
                    <td id='userName${data[i].ID}'>${data[i].Name}</td>
                    <td id='userAddress${data[i].ID}'>${data[i].Address}</td>
                    <td id='userTel${data[i].ID}'>${data[i].Tel}</td>
                    <td id='userEmail${data[i].ID}'>${data[i].Email}</td>
                    <td class="text-center table-btn prevent-select">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="userUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Name}', '${data[i].Address}', '${data[i].Tel}', '${data[i].Email}')">แก้ไข</button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" id="userDelete${data[i].ID}" onclick="confirmDeleteUser(${data[i].ID}, '${data[i].Name}')">ลบ</button>
                    </td>
                </tr>`;
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
    document.getElementById('updateUserIdInput').value = id
    document.getElementById('updateUserNameInput').value = name
    document.getElementById('updateUserAddressInput').value = address
    document.getElementById('updateUserTelInput').value = tel
    document.getElementById('updateUserEmailInput').value = email
}

async function updateUserInfo() {
    const userId = document.getElementById('updateUserIdInput').value;
    const userName = document.getElementById('updateUserNameInput').value;
    const userAddress = document.getElementById('updateUserAddressInput').value;
    const userTel = document.getElementById('updateUserTelInput').value;
    const userEmail = document.getElementById('updateUserEmailInput').value;

    const saveBtn = document.getElementById('updateUserBtn');
    const cancleBtn = document.getElementById('updateUserCancleBtn');

    const userInfo = {
        Name: userName,
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
            document.getElementById(`userName${userId}`).innerText = userName
            document.getElementById(`userAddress${userId}`).innerText = userAddress
            document.getElementById(`userTel${userId}`).innerText = userTel
            document.getElementById(`userEmail${userId}`).innerText = userEmail
            document.getElementById(`userUpdate${userId}`).setAttribute('onclick', `openUpdateModal(${userId}, '${userName}', '${userAddress}', '${userTel}', '${userEmail}')`)
            document.getElementById(`userDelete${userId}`).setAttribute('onclick', `confirmDeleteUser(${userId}, '${userName}')`)
            resultTitle.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> บันทึกข้อมูลสำเร็จ`
            resultBody.innerHTML = `บันทึกการเปลี่ยนแปลงข้อมูลแล้ว`
            $("#updateUserModal").modal("hide");
            $("#processResultModal").modal("show");
            saveBtn.disabled = false
            cancleBtn.disabled = false
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
    const userAddress = document.getElementById('createUserAddressInput').value;
    const userTel = document.getElementById('createUserTelInput').value;
    const userEmail = document.getElementById('createUserEmailInput').value;

    const saveBtn = document.getElementById('createUserBtn').value;
    const cancleBtn = document.getElementById('createUserCancleBtn').value;

    const userInfo = {
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
    const tel = document.getElementById('searchText').value

    searchBtn.disabled = true

    try {
        const response = await fetch(`http://127.0.0.1:8080/customers/search/${tel}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log(data);
            document.getElementById('getAllUserBtn').innerText = 'ข้อมูลลูกค้าทั้งหมด'
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
                    <tr id="customerId${data[i].ID}">
                        <td class='text-center'>${data[i].ID}</td>
                        <td id='userName${data[i].ID}'>${data[i].Name}</td>
                        <td id='userAddress${data[i].ID}'>${data[i].Address}</td>
                        <td id='userTel${data[i].ID}'>${data[i].Tel}</td>
                        <td id='userEmail${data[i].ID}'>${data[i].Email}</td>
                        <td class="text-center table-btn prevent-select">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="userUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Name}', '${data[i].Address}', '${data[i].Tel}', '${data[i].Email}')">แก้ไข</button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" id="userDelete${data[i].ID}" onclick="confirmDeleteUser(${data[i].ID}, '${data[i].Name}')">ลบ</button>
                        </td>
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
                    ไม่พบข้อมูล
                </div>`
            }
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