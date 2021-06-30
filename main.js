const ipInput = document.getElementById('ip-input');
const loader = document.getElementById('loader');

const ipRegx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const url = 'https://geo.ipify.org/api/v1?apiKey=at_2GP2cfwUTrblxlRWx832PNbRFsVzp';
const queryParamIp = '&ipAddress=';
const queryParamDomain = '&domain=';



const getInfo = async (endpointUrl) => {
    
    try{
        showLoader();
        const response = await fetch(endpointUrl, {cache: 'no-cache'});
        
        if(response.ok){
            const jsonResponse = await response.json();     
            renderResponse(jsonResponse);            
            hideLoader();     
            renderMap(jsonResponse);
            // console.log(jsonResponse)

        }else{
            hideLoader();     
            throw new Error('Request failed! Check You Address');
        }
    }
    catch(error){
        alert(error);
    }
};


const showLoader = () => {
    loader.style.display = 'flex'
};

const hideLoader = () => {
    loader.style.display = 'none'
};

const ipEl = document.getElementById('ip-add');
const locEl = document.getElementById('ip-location');
const tzEl = document.getElementById('ip-timezone');
const ispEl = document.getElementById('ip-isp');

const renderResponse = (res) =>{
    ipEl.textContent = res.ip;
    locEl.textContent = res.location.city + ', ' + res.location.region;
    tzEl.textContent = 'UTC  ' + res.location.timezone;
    ispEl.textContent = res.isp;
}

const renderMap = (res) => {
    const lat = res.location.lat;
    const lng = res.location.lng;
    const cords = [lat, lng];

    const container = L.DomUtil.get('ip-map'); 
    
    //check if map is already intialized
    if(container != null){ container._leaflet_id = null; container.innerHTML = null};
    
    
    const mymap = L.map('ip-map').setView(cords, 15);

    const locIcon = L.icon({
        iconUrl: 'images/icon-location.svg',
        // shadowUrl: 'images/icon-location.svg',
    
        iconSize:     [44, 56], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const marker = L.marker(cords, {icon : locIcon}).addTo(mymap);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoibmljb2JyZWlucyIsImEiOiJja3FpaDFnZWUwN2E1MnZxc3BpanZxNTgyIn0.H-DcYPL9vf-PNJmmtQ0Ngg'
    }).addTo(mymap);

    console.log(container);


}


const finalRenderLogic = () => {
    const ipInputVal = ipInput.value;
    const endpointIp  = url + queryParamIp + ipInputVal;
    const endpointDomain  = url + queryParamDomain + ipInputVal;

    if(ipRegx.test(ipInputVal.value) || ipInputVal.value === ''){
        getInfo(endpointIp);
    } else {
        // alert('Invalid IP Address');
        getInfo(endpointDomain);

    }

    return false
}

// const submitBtn = document.getElementById('ip-submit');
// submitBtn.onclick = finalRenderLogic;


