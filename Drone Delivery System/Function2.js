const url = "http://localhost:3000";
async function consegnePerZona() {
    try{
    const response = await fetch(url + "/deliveries")
    if(!response.ok){
        throw new Error("Errore nel recupero delle consegne. ");

    }

    const data = await response.json();
    const deliveries = data.deliveries;
    
    const zoneCount = {
        north:0,
        south:0,
        east:0,
        west:0,
        central:0
    };

    for(let i = 0; i < deliveries.length; i++){
        const delivery = deliveries[i];
        const zona = delivery.destination.zone;

        if(zoneCount[zona] !== undefined){
            zoneCount[zona]++;
        }
    }
    return zoneCount;
}catch(error){
    console.log(error);
}
}

consegnePerZona().then(result => console.log(result));

