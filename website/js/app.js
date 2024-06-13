async function getCustomers() {
    fetch('http://127.0.0.1:8080/customers', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            for (i = 0; i < data.length; i++) {
                if (i == 0) {
                    document.getElementById('output').innerHTML = `ID: ${data[i].ID} ชื่อ: ${data[i].Name} ที่อยู่: ${data[i].Address} เบอร์โทรศัพท์: ${data[i].Tel} อีเมล: ${data[i].Email}`;
                } else {
                    document.getElementById('output').innerHTML += `<br>ID: ${data[i].ID} ชื่อ: ${data[i].Name} ที่อยู่: ${data[i].Address} เบอร์โทรศัพท์: ${data[i].Tel} อีเมล: ${data[i].Email}`;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}