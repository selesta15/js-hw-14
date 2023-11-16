document.addEventListener('DOMContentLoaded', () => {
    const fetchData = (name) => {
        const url = `https://api.genderize.io?name=${name}`;
    
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };
    
    const displayData = (data) => {
        const tableBody = document.querySelector('#userData tbody');
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }
    
        const newRow = tableBody.insertRow();
        const nameCell = newRow.insertCell();
        const genderCell = newRow.insertCell();
        const probabilityCell = newRow.insertCell();
    
        nameCell.innerText = data.name;
        genderCell.innerText = data.gender;
        probabilityCell.innerText = data.probability;
    };
    
    const handleFetchError = () => {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
        } else {
            console.error('Error message element not found');
        }
    };
    
    const toggleLoader = (show) => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        } else {
            console.error('Loader element not found');
        }
    };
    
    const btnRefetch = document.getElementById('btnRefetch');
    btnRefetch.addEventListener('click', () => {
        toggleLoader(true);
        btnRefetch.disabled = true;

        const names = ['Alice', 'Bob', 'Charlie', 'Anna', 'John', 'Julia'];
        const tableBody = document.querySelector('#userData tbody');

        if (tableBody) {
            tableBody.innerHTML = '';
        } else {
            console.error('Table body element not found');
            toggleLoader(false);
            btnRefetch.disabled = false;
            return;
        }

        const promises = names.map(name => fetchData(name)
            .then(data => displayData(data))
            .catch(error => {
                console.error('Error occurred:', error);
                handleFetchError();
            }));

        Promise.all(promises)
            .then(() => {
                toggleLoader(false);
                btnRefetch.disabled = false;
            })
            .catch(error => {
                console.error('Error occurred:', error);
                toggleLoader(false);
                handleFetchError();
                btnRefetch.disabled = false;
            });
    });
});
