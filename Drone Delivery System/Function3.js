const url = "http://localhost:3000";
async function CreazioneConsegna(){
    try{
        console.log("Funzione Creazione Consegna avviata");

        const nuovaConsegna = {
            destination: {
                address: "Via occhio di Sauron 67",
                zone: "east"
            }, 
            package: {
               weight: 4.2, 
               category: "electronics", 
            }, 
            priority: "medium"
        };

        const postResponse = await fetch(url + "/deliveries", {
            method: "POST", 
            headers: { "Content-Type": "application/json"}, 
            body: JSON.stringify(nuovaConsegna)
        });

        if(!postResponse.ok){
            throw new Error("Errore nella consegna della consegna. ");
        }

        const postData = await postResponse.json();
        const saveId = postData.delivery.id;

        const getResponse = await fetch(url + "/deliveries");

        if(!getResponse.ok){
            throw new Error("Errore nella creazione della consegna. ")
        }
        const getData = await getResponse.json();
        const deliveries = getData.deliveries;

        let found = false;
    
        
        for (let i = 0; i < deliveries.length; i++){
            if(deliveries[i].id === saveId){
                found = true;
                break;
            }
        }

        const total = deliveries.length;

        return {
            created: found, 
            deliveryId: saveId, 
            totalDeliveries: total
        };

    }catch(error){
        console.log(error)
    }
}

CreazioneConsegna().then(result => console.log(result));
