var customersData

getCustomers()

async function getCustomers() {
    await fetch('http://127.0.0.1:8080/customers', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            customersData = data
            document.getElementById('outputContainer').innerHTML = `
                <div class="ovf-scroll p-3 card-bg rounded-corner blur text-center animate__animated animate__bounceIn">
                    <table class="text-start">
                        <tbody id="outputTable">
                            <th class='text-center'>ID</th>
                            <th>ชื่อ</th>
                            <th class='table-address'>ที่อยู่</th>
                            <th>เบอร์โทรศัพท์</th>
                            <th>อีเมล</th>
                            <th class="text-center">ดำเนินการ</th>
                        </tbody>
                    </table>
                </div>
                `
            for (i = 0; i < data.length; i++) {
                document.getElementById('outputTable').innerHTML += `
                <tr id="customerId${data[i].ID}">
                    <td class='text-center'>${data[i].ID}</td>
                    <td id='userName${data[i].ID}'>${data[i].Name}</td>
                    <td id='userAddress${data[i].ID}'>${data[i].Address}</td>
                    <td id='userTel${data[i].ID}'>${data[i].Tel}</td>
                    <td id='userEmail${data[i].ID}'>${data[i].Email}</td>
                    <td class="text-center table-btn">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="userUpdate${data[i].ID}" onclick="openUpdateModal(${data[i].ID}, '${data[i].Name}', '${data[i].Address}', '${data[i].Tel}', '${data[i].Email}')">แก้ไข</button>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" onclick="confirmDeleteUser(${data[i].ID}, '${data[i].Name}')">ลบ</button>
                    </td>
                </tr>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
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

    const userInfo = {
        Name: userName,
        Address: userAddress,
        Tel: userTel,
        Email: userEmail
    };

    try {
        const response = await fetch(`http://127.0.0.1:8080/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            document.getElementById(`userName${userId}`).innerText = userName
            document.getElementById(`userAddress${userId}`).innerText = userAddress
            document.getElementById(`userTel${userId}`).innerText = userTel
            document.getElementById(`userEmail${userId}`).innerText = userEmail
            document.getElementById(`userUpdate${userId}`).setAttribute('onclick', `openUpdateModal(${userId}, '${userName}', '${userAddress}', '${userTel}', '${userEmail}')`)
        } else {
            console.error('Failed to update user info:', response.status);
            console.error(data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function confirmDeleteUser(id, name) {
    console.log(customersData)
    document.getElementById('deleteModalContent').innerHTML = `คุณต้องการลบข้อมูลของคุณ <b>${name}</b> ใช่หรือไม่`
    document.getElementById('confirmDeleteBtn').setAttribute("onclick", `deleteUser(${id})`);
}

async function deleteUser(id) {
    await fetch(`http://127.0.0.1:8080/customers/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById(`customerId${id}`).remove()
        })
        .catch(error => {
            console.error('Error:', error);
        });
}