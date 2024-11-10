

export default async function fetchData(script,date){
    try {
        const response = await fetch(`http://localhost:5000/data/${script}/${date}`);
        if(!response.ok){
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        // console.log(data);
        return data;
    }
    catch(error){
        console.log('Error:',error);
    }
}