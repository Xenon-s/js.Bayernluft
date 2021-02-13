
// standardpath
const userPath = "0_userdata.0.bayernluefter";

// polling timer (min. 5000ms, max 60000ms);
let poll = 10000; //polling time in MS

// devices
const device = {
    1: { ip: "192.168.0.34", port: "80" },
};

// Finger weg !
// Bei updates muss erst ab hier kopiert und eingefügt werden, somit braucht man seine Geräteliste nicht jedes mal neu erstellen
// Schnittstelle Bayernluefter V 0.1 Alpha JS
// dev: xenon-s

const http = require("http");
const vers = "0.0.1 ALPHA"
console.log(`bayernluefter Script V. ${vers} started`);

//cmds
const ENDPOINT_EXPORT = "?export=1"
const ENDPOINT_TEMPLATE = "/export.txt"
const ENDPOINT_POWER_ON = "?power=on"
const ENDPOINT_POWER_OFF = "?power=off"
const ENDPOINT_BUTTON_POWER = "?button=power"
const ENDPOINT_BUTTON_TIMER = "?button=timer"
const ENDPOINT_SPEED = "?speed="
const ENDPOINT_SYNC_TIME = "index.html?TimeSync=1"

let objTrigger = {};
let arrTrigger = [];

let timeout = null;
if (poll < 5000) {
    poll = 5000;
} else if (poll > 60000) {
    poll = 60000;
};

functionCall();

async function functionCall() {
    // check for connection
    await createCmd(ENDPOINT_EXPORT, "start");
    await createCmd(ENDPOINT_EXPORT, "loop");
    // start loop
    loop();
};

/**
* @param {string} cmd
* @param {string} action
*/
async function createCmd(cmd, action) {
    for (const i in device) {
        const path = `http://${device[i].ip}:${device[i].port}/${cmd}`
        getData(device[i], path, action);
    };
};

// intervall
async function loop() {
    if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
    };
    setTimeout(async function () {
        createCmd(ENDPOINT_EXPORT, "loop");
        loop();
    }, poll);
};

/**
* @param {{ data: any; param: any; states: any; }} id
* @param {string | import("http").RequestOptions | import("url").URL} path
* @param {string} action
*/
async function getData(id, path, action) {
    http.get(path, async function (res) {
        res.setEncoding('utf8');
        let data = '';
        if (res.statusCode === 200) {
            res.on('data', async d => data += d);
            res.on('end', async () => {
                try {
                    const obj = await JSON.parse(data);
                    id.data = obj.data;
                    id.param = obj.parameter;
                    id.states = obj.states;
                    switch (action) {
                        case "start": {
                            sendData(id, "start");
                            break;
                        };
                        case "loop": {
                            sendData(id, "loop");
                            break;
                        };
                        default: {
                            console.warn(`wrong Input: ${action}`);
                        };
                    };
                } catch (e) {
                    //JSON kaputt...
                    console.warn(e);
                }
            });
        } else {
            //HTTP Request failed
            console.warn(`REQUEST FAILED: ${path}`);
        };
    });
};

/**
* @param {{ data: any; param: any; states: any; ip?: any; }} id
* @param {string} cmd
*/
async function sendData(id, cmd) {
    // states 
    const data = {
        // data
        1: { name: "json", path: "data.json", ini: `${JSON.stringify(id)}`, parse: '{"name":"json","type":"string","read":true,"write":false}' },
        2: { name: "date", path: `data.date`, ini: `${id.data.date}`, parse: '{"name":"date","type":"string","read":true,"write":false}' },
        3: { name: "time", path: `data.time`, ini: `${id.data.time}`, parse: '{"name":"time","type":"string","read":true,"write":false}' },
        4: { name: "name", path: `data.name`, ini: `${id.data.name}`, parse: '{"name":"name","type":"string","read":true,"write":false}' },
        5: { name: "mac", path: `data.mac`, ini: `${id.data.mac}`, parse: '{"name":"mac","type":"string","read":true,"write":false}' },
        6: { name: "local_IP", path: `data.local_IP`, ini: `${id.data.local_IP}`, parse: '{"name":"local_IP","type":"string","read":true,"write":false}' },
        7: { name: "rssi", path: `data.rssi`, ini: `${id.data.rssi}`, parse: '{"name":"rssi","type":"string","read":true,"write":false}' },
        8: { name: "fw_Maincontroller", path: `data.fw_Maincontroller`, ini: `${id.data.fw_MainController}`, parse: '{"name":"fw_MainController","type":"string","read":true,"write":false}' },
        9: { name: "fw_WiFi", path: `data.fw_WiFi`, ini: `${id.data.fw_WiFi}`, parse: '{"name":"fw_WiFi","type":"string","read":true,"write":false}' },
    };
    const parameter = {
        // parameter
        100: { name: "temperature_In", path: "paramter.temperature_In", ini: await replaceStr("str", id.param.temperature_In), parse: '{"name":"temperature_In","type":"number","unit":"°C","read":true,"write":false}' },
        101: { name: "temperature_Out", path: "paramter.temperature_Out", ini: await replaceStr("str", id.param.temperature_Out), parse: '{"name":"temperature_Out","type":"number","unit":"°C","read":true,"write":false}' },
        102: { name: "temperature_Fresh", path: "paramter.temperature_Fresh", ini: await replaceStr("str", id.param.temperature_Fresh), parse: '{"name":"temperature_Fresh","type":"number","unit":"°C","read":true,"write":false}' },
        103: { name: "rel_Humidity_In", path: "paramter.rel_Humidity_In", ini: await replaceStr("str", id.param.rel_Humidity_In), parse: '{"name":"rel_Humidity_In","type":"number","unit":"%","min":0, "max":100,"read":true,"write":false}' },
        104: { name: "rel_Humidity_Out", path: "paramter.rel_Humidity_Out", ini: await replaceStr("str", id.param.rel_Humidity_Out), parse: '{"name":"rel_Humidity_Out","type":"number","unit":"%","min":0, "max":100,"read":true,"write":false}' },
        105: { name: "abs_Humidity_In", path: "paramter.abs_Humidity_In", ini: await replaceStr("str", id.param.abs_Humidity_In), parse: '{"name":"abs_Humidity_In","type":"number","unit":"g/m³","read":true,"write":false}' },
        106: { name: "abs_Humidity_Out", path: "paramter.abs_Humidity_Out", ini: await replaceStr("str", id.param.abs_Humidity_Out), parse: '{"name":"abs_Humidity_Out","type":"number","unit":"g/m³","read":true,"write":false}' },
        107: { name: "efficiency", path: "paramter.efficiency", ini: await replaceStr("str", id.param.efficiency), parse: '{"name":"efficiency","type":"number","unit":"%","min":0, "max":100,"read":true,"write":false}' },
        108: { name: "humidity_Transport", path: "paramter.humidity_Transport", ini: await replaceStr("str", id.param.humidity_Transport), parse: '{"name":"humidity_Transport","type":"number","unit":"g/24h","read":true,"write":false}' },
    };
    const states = {
        // states
        200: { name: "speed_In", path: "states.speed_In", ini: parseInt(id.states.speed_In), parse: '{"name":"speed_In","type":"number","unit":"/10","min":0, "max":10,"read":true,"write":false}' },
        201: { name: "speed_Out", path: "states.speed_Out", ini: parseInt(id.states.speed_Out), parse: '{"name":"speed_Out","type":"number","unit":"/10","min":0, "max":10,"read":true,"write":false}' },
        202: { name: "SystemOn", path: "states.SystemOn", ini: await replaceStr("bool", id.states.SystemOn), parse: '{"name":"SystemOn","type":"boolean","read":true,"write":false}' },
        204: { name: "AntiFreeze", path: "states.AntiFreeze", ini: await replaceStr("bool", id.states.AntiFreeze), parse: '{"name":"AntiFreeze","type":"boolean","read":true,"write":false}' },
        205: { name: "Fixed_Speed", path: "states.Fixed_Speed", ini: await replaceStr("bool", id.states.Fixed_Speed), parse: '{"name":"Fixed_Speed","type":"boolean","read":true,"write":false}' },
        206: { name: "Defrosting", path: "states.Defrosting", ini: await replaceStr("bool", id.states.Defrosting), parse: '{"name":"Defrosting","type":"boolean","read":true,"write":false}' },
        207: { name: "Landlord_Mode", path: "states.Landlord_Mode", ini: await replaceStr("bool", id.states.Landlord_Mode), parse: '{"name":"Landlord_Mode","type":"boolean","read":true,"write":false}' },
        208: { name: "Cross_Ventilation", path: "states.Cross_Ventilation", ini: await replaceStr("bool", id.states.Cross_Ventilation), parse: '{"name":"Cross_Ventilation","type":"boolean","read":true,"write":false}' },
        209: { name: "Timer_active", path: "states.Timer_active", ini: await replaceStr("bool", id.states.Timer_active), parse: '{"name":"Timer_active","type":"boolean","read":true,"write":false}' },
        210: { name: "polling_In_Sec", path: "states.polling_In_Sec", ini: (poll / 1000), parse: '{"name":"polling_In_Sec","type":"number","unit":"s","read":true,"write":false}' },
    };

    const cmds = {
        // cmds
        300: { name: "set_Speed", path: "commands.set_Speed", ini: parseInt(id.states.speed_In), cmd: `${id.ip}${ENDPOINT_SPEED}`, parse: '{"name":"set_Speed","type":"number","unit":"/10","min":1, "max":10,"read":true,"write":true, "role":"level"}' },
        301: { name: "set_State_On", path: "commands.set_State_On", ini: false, cmd: `${id.ip}${ENDPOINT_POWER_ON}`, parse: '{"name":"set_State_On","type":"boolean","read":false,"write":true, "role":"button"}' },
        302: { name: "set_State_Off", path: "commands.set_State_Off", ini: false, cmd: `${id.ip}${ENDPOINT_POWER_OFF}`, parse: '{"name":"set_State_Off","type":"boolean","read":false,"write":true, "role":"button"}' },
        303: { name: "set_Timer", path: "commands.set_Timer", ini: false, cmd: `${id.ip}${ENDPOINT_BUTTON_TIMER}`, parse: '{"name":"set_Timer","type":"boolean","read":false,"write":true, "role":"button"}' },
        304: { name: "set_Auto_Mode ", path: "commands.set_Auto_Mode ", ini: false, cmd: `${id.ip}${ENDPOINT_SPEED}0`, parse: '{"name":"set_Auto_Mode","type":"boolean","read":false,"write":true, "role":"button"}' },
        305: { name: "toggle_State", path: "commands.toggle_State", ini: false, cmd: `${id.ip}${ENDPOINT_BUTTON_POWER}`, parse: '{"name":"toggle_State","type":"boolean","read":false,"write":true, "role":"button"}' },
        306: { name: "sync_Time", path: "commands.sync_Time", ini: false, cmd: `${id.ip}${ENDPOINT_SYNC_TIME}`, parse: '{"name":"sync_Time","type":"boolean","read":false,"write":true, "role":"button"}' },
        refresh: { cmd: `${id.ip}${ENDPOINT_EXPORT}` },
    };

    if (cmd === "start") {
        // create states
        await putData(cmds, cmd, id);
        await createTrigger(await createArrTrigger(cmds, id));
    };

    await putData(data, cmd, id);
    await putData(parameter, cmd, id);
    await putData(states, cmd, id);

};

/**
* @param {string} str
* @param {string} cmd
*/
async function replaceStr(cmd, str) {
    switch (cmd) {
        case "str": {
            let valTemp = 0;
            valTemp = parseFloat(await str.replace(",", "."));
            return valTemp;
        };
        case "bool": {
            let valTemp = false;
            if (str == "1") {
                valTemp = true;
            } else if (str == "0") {
                valTemp = false;
            };
            return await valTemp;
        };
        case "manual": {
            let valTemp = false;
            if (str == "1") {
                valTemp = false;
            } else if (str == "0") {
                valTemp = true;
            };
            return await valTemp;
        };
    };
};

async function putData(obj, cmd, id) {
    let path = ``;
    for (const i in obj) {
        path = `${userPath}.${id.data.mac}.${obj[i].path}`;
        switch (cmd) {
            case "start": {
                // create states
                if (obj[i].name != undefined) {
                    if (!getObject(path)) {
                        if (obj[i].ini != undefined && obj[i].ini != null) {
                            createState(path, obj[i].ini, JSON.parse(obj[i].parse), async function () {
                            });
                        } else {
                            createState(path, JSON.parse(obj[i].parse), async function () {
                            });
                        };
                        id.finalPath = `${userPath}.${id.data.mac}.${obj[i].path}`;
                    };
                };
                break;
            };
            case "loop": {
                // set States
                if (obj[i].ini != undefined && obj[i].ini != null) {
                    await setStateAsync(path, obj[i].ini, true);
                };
                break;
            };
        };
    };
};

// create arr Trigger
async function createArrTrigger(obj, id) {
    let objTemp = {};
    for (const i in obj) {
        let _id = ``;
        // format path
        obj[i].path = `${userPath}.${id.data.mac}.${obj[i].path}`;
        _id = obj[i].path;
        objTemp[_id] = { trigger: obj[i].path, cmd: obj[i].cmd, refresh: obj.refresh.cmd };
        arrTrigger.push({ [_id]: { trigger: obj[i].path, cmd: obj[i].cmd, refresh: obj.refresh.cmd } });
        objTrigger[_id] = objTemp[_id]
    };
    return arrTrigger;
};

// create trigger
async function createTrigger(arr) {
    arr.forEach(function (obj) {
        for (const i in obj) {
            on({ id: obj[i].trigger, change: "any", ack: false }, async function (obj) {
                let trigger_ID = ``;
                let trigger_cmd = ``;
                let type = ``;
                let objTemp = {};
                let value = obj.state.val;
                let reqTemp = ``;

                trigger_ID = await objTrigger[obj.id].trigger;
                trigger_cmd = await objTrigger[obj.id].cmd;
                objTemp = await getObjectAsync(`${objTrigger[obj.id].trigger}`);

                type = await objTemp.common.type
                switch (type) {
                    case "boolean":
                        if (value) {
                            reqTemp = `http://${trigger_cmd}`;
                            await setStateAsync(trigger_ID, false, true);
                            await setHTTP(reqTemp)
                        };
                        break;
                    case "number":
                        if (Number.isInteger(value)) {
                            await setStateAsync(trigger_ID, value, true);
                            reqTemp = `http://${trigger_cmd}${value}`;
                            await setHTTP(reqTemp);
                        };
                        break;
                    default:
                        console.warn(`INPUT ERROR : ${objTemp}`);
                        break;
                };
            });
        };
    });
};

// setHTTP action request
/**
* @param {string | import("http").RequestOptions | import("url").URL} path
*/
async function setHTTP(path) {
    http.get(path);
    let timeoutHTTP = null;
    if (timeoutHTTP != null) {
        clearTimeout(timeoutHTTP);
        timeoutHTTP = null;
    };
    timeoutHTTP = setTimeout(async function () {
        createCmd(ENDPOINT_EXPORT, "loop");
    }, 1000);
};



