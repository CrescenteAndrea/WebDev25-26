const url = "http://localhost:3000";
async function droniCritici(){
    console.log("Funzione droniCritici avviata");

    try{
    const response = await fetch (url + "/drones");
    if(!response.ok){
        throw new Error("Errore nel recupero dei droni");
    }

    const data = await response.json();
    const drones = data.drones; //estrai l'array dei droni dalla risposta

    const critical = [];

    for(let i = 0; i < drones.length;i++){
        const d = drones[i];

        const isCritical = d.battery < 30 || d.status === "maintenance" || d.maintenance.issues.length > 0;

        if(isCritical){
            critical.push(d); //aggiungi il drone all'array dei critici
        }
    }

    const formatted = [];
    for(let i = 0; i < critical.length; i++){
        const d = critical[i];
        formatted.push({
            id: d.id, 
            battery: d.battery, 
            status: d.status, 
            issuesCount: d.maintenance.issues.length
        });
    }
    for(let i = 0; i < formatted.length; i++){
        for(let j = i+1; j < formatted.length; j++){
            if(formatted[i].battery > formatted[j].battery){
                const temp = formatted[i];
                formatted[i] = formatted[j];
                formatted[j] = temp;
            }
        }
    }
    return formatted;

    }catch(error){
        console.log(error);
    }
}
droniCritici().then(result => console.log(result));
