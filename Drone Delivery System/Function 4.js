const url = "http://localhost:3000";
async function generalReport() {
    try{
        console.log("Funzione report generale avviata");
        const dronesResponse = await fetch(url + "/drones");
        const deliveriesResponse = await fetch(url + "/deliveries");
        const statusZoneResponse = await fetch(url + "/zones/stats");

        if(!dronesResponse.ok || !deliveriesResponse.ok || !statusZoneResponse.ok){
            throw new Error("Errore nel recupero dei dati. ");
        }
        const dronesData = await dronesResponse.json();
        const deliveriesData = await deliveriesResponse.json();
        const statusZoneData = await statusZoneResponse.json();

        const drones = dronesData.drones;
        const deliveries = deliveriesData.deliveries;
        const zonestatus = statusZoneData.zones;

        const conteggioDroni = {
            available: 0, 
            assigned: 0,
            flying: 0,
            charging: 0, 
            maintenance: 0
        };

        for(let i = 0; i < drones.length; i++){
            const stat = drones[i].status;
            if(conteggioDroni[stat] !== undefined){
                conteggioDroni[stat]++;
            }
        }

        const conteggioSpedizioni = {
            pending: 0,
            assigned: 0,
            "in-transit": 0, 
            completed : 0
        };

        for(let i = 0; i < deliveries.length; i++){
            const stat = deliveries[i].status;
            if(conteggioSpedizioni[stat] !== undefined){
                conteggioSpedizioni[stat]++;
            }
        }

        let maxZone = null;
        let maxDeliveries = -1;

        for(let i = 0; i < zonestatus.length; i++){
            const z = zonestatus[i];
            if(z.activeDeliveries > maxDeliveries){
                maxDeliveries = z.activeDeliveries;
                maxZone = z.zone;
            }
        }

        console.log("=== DRONE DELIVERY SYSTEM ===\n");

        console.log("Droni disponibili:", conteggioDroni.available);
        console.log("Droni assegnati:", conteggioDroni.assigned);
        console.log("Droni in volo:", conteggioDroni.flying);
        console.log("Droni in ricarica:", conteggioDroni.charging);
        console.log("Droni in manutenzione:", conteggioDroni.maintenance);

        console.log("");

        console.log("Consegne pending:", conteggioSpedizioni ["pending"]);
        console.log("Consegne assigned:", conteggioSpedizioni ["assigned"]);
        console.log("Consegne in-transit:", conteggioSpedizioni ["in-transit"]);
        console.log("Consegne completate:", conteggioSpedizioni ["completed"]);

        console.log("");

        console.log("Zona più attiva:", maxZone, `(${maxDeliveries} consegne attive)`);
    }catch(error){
        console.log(error);
    }
}

generalReport().then(result => console.log(result));
