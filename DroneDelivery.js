const url = "http://localhost:3000";

async function DroniCritici(){
    console.log("Funzione droniCritici avviata");
    try{
        const response = await fetch(url + "/drones");
        if(!response.ok){
            throw new Error("Errore nel recupero droni.");
        }
        const data = await response.json();
        const drones = data.drones; // estraggo l'array dei droni

        const critical = [];

        for(let i = 0; i < drones.length; i++){
            const d = drones[i];
        const isCritical = d.battery < 30 || d.status === "maintenance" || d.maintenance.issues.length > 0;

        if(isCritical){
            const obj = {
            id: d.id, 
            battery: d.battery, 
            status: d.status, 
            issuesCount: d.maintenance.issues.length
            };

            critical.push(obj);
        }
    }

        critical.sort((a, b) => a.battery - b.battery);

        return critical;



    }catch(error){
        console.log(error);
    }
}DroniCritici().then(result => console.log(result));

async function ConsegnePerZona(){
    try{
        const response = await fetch(url + "/deliveries");
        if(!response.ok){
            throw new Error("Errore nella consegna. ");
        }
        const data = await response.json();
        const deliveries = data.deliveries;
        const z = {
            north: 0, 
            south: 0, 
            east: 0, 
            west: 0, 
            central: 0
        };
        for(let i = 0; i < deliveries.length; i++){
            const delivery = deliveries[i];
            const zona = delivery.destination.zone;
            if(z[zona] !== undefined){
                z[zona]++;

            }
        }
        return z;

    }catch(error){
        console.log(error);
    }
}
ConsegnePerZona().then(result => console.log(result));

async function CreazioneVerificaConsegna(){
    try{
       const NuovaConsegna = {
        destination: {
            address: "Via occhio di sauron", 
            zone: "east"
        }, 
        package: {
            weight: 4.2, 
            category: "electronics"
        }, 
        priority: "medium"
    };

    const postResponse = await fetch(url + "/deliveries" , {
        method: "POST", 
        headers: { "Content-Type" : "application/json"}, 
        body: JSON.stringify(NuovaConsegna)
    });

    if(!postResponse.ok){
        throw new Error("Errore nella creazione della nuova consegna. ");
    }
    const postData = await postResponse.json();
    const saveID = postData.delivery.id;

    const getResponse = await fetch(url + "/deliveries");
    
    if(!getResponse.ok){
        throw new Error("Errore nella verifica della consegna. ");
    }

    const getData = await getResponse.json();
    const deliveries = getData.deliveries;

    let found = false;

    for(let i = 0; i < deliveries.length; i++){
        if(deliveries[i].id === saveID){
            found = true; 
            break; 
        }

    }
    const total = deliveries.length;

    return {
            created: found, 
            deliveryId: saveID, 
            totalDeliveries: total
        };
    }catch(error){
        console.log(error);
    }
}
CreazioneVerificaConsegna().then(result => console.log(result));

async function DashBoard(){
    try{
        const responseDroni = await fetch(url + "/drones");
        const responseConsegne = await fetch(url + "/deliveries");
        const responseZone = await fetch (url + "/zones/stats");

        if(!responseDroni.ok || !responseConsegne.ok || !responseZone.ok){
            throw new Error("Errore nel recupero dei dati. ");
        }
        const dataDroni = await responseDroni.json();
        const dataConsegne = await responseConsegne.json();
        const dataZone = await responseZone.json();

        const drones = dataDroni.drones;
        const deliveries = dataConsegne.deliveries;
        const zones = dataZone.zones;

        //contare quanti droni per ogni status

        const ConteggioDroni = {
            available: 0,
            assigned: 0,
            "in-flight": 0,
            charging: 0,
            maintenance: 0
        };

        for(let i = 0; i < drones.length; i++){
            const stat = drones[i].status;
            if(ConteggioDroni[stat] !== undefined){
                ConteggioDroni[stat]++;
            }
        }

        const ConteggioConsegne = {
            pending: 0, 
            assigned: 0, 
            "in-transit": 0, 
            completed: 0
        };

        for(let i = 0; i < deliveries.length; i++){
            const stat = deliveries[i].status;
            if(ConteggioConsegne[stat] !== undefined){
                ConteggioConsegne[stat]++;
            }
        }

        let maxZone = null;
        let maxDeliveries = -1;

       for(let i = 0; i < zones.length; i++){
    const z = zones[i];

    if(z.activeDeliveries > maxDeliveries){
        maxDeliveries = z.activeDeliveries;
        maxZone = z.name;
    }

        }
             console.log("=== DRONE DELIVERY SYSTEM ===\n");

        console.log("Droni disponibili:", ConteggioDroni.available);
        console.log("Droni assegnati:", ConteggioDroni.assigned);
        console.log("Droni in volo:", ConteggioDroni["in-flight"]);
        console.log("Droni in ricarica:", ConteggioDroni.charging);
        console.log("Droni in manutenzione:", ConteggioDroni.maintenance);

        console.log("");

        console.log("Consegne pending:", ConteggioConsegne ["pending"]);
        console.log("Consegne assigned:", ConteggioConsegne ["assigned"]);
        console.log("Consegne in-transit:", ConteggioConsegne ["in-transit"]);
        console.log("Consegne completate:", ConteggioConsegne ["completed"]);

        console.log("");

        console.log("Zona più attiva:", maxZone, `(${maxDeliveries} consegne attive)`);


    }catch(error){
        console.log(error);
    }
}
DashBoard();
