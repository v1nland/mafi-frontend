export function APIURL(){
    return 'https://mafi-backend-go.herokuapp.com/v1'
    // return 'http://192.168.0.17:8080'
    // return 'http://localhost:8080/v1'
}

export function FetchDataTablesLang(){
    return fetch(`http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json`)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
export function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(1) + " " + twoDigits(0) + ":" + twoDigits(0) + ":" + twoDigits(0);
};

/////////////////// BEGIN /////////////////////////
/////////////////// ORDERS      ///////////////////
/////////////////// ORDERS      ///////////////////
export function FetchPendingOrders() {
    var FetchURL = `${APIURL()}/order/pending`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function FetchOrders() {
    var FetchURL = `${APIURL()}/order`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        console.log(resp);
        return resp
    })
    .catch(err => {
        return err
    })
}

export function InsertOrder( jsonData ) {
    var FetchURL = `${APIURL()}/order`;
    console.log(JSON.stringify(jsonData));

    return fetch(FetchURL, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function UpdateOrderState( id, currentValue ) {
    var FetchURL = `${APIURL()}/order/${id}`;
    var nextValue = 1 - parseInt(currentValue, 10);

    return fetch(FetchURL, {
        method: 'PUT',
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        },
        body: JSON.stringify( { "finished": nextValue } )
    })
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

/////////////////// BEGIN /////////////////////////
/////////////////// STATS       ///////////////////
/////////////////// STATS       ///////////////////
export function FetchMostSoldItem() {
    var FetchURL = `${APIURL()}/stat/mostSoldItem`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function FetchBox() {
    var FetchURL = `${APIURL()}/stat/box`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function FetchSources() {
    var FetchURL = `${APIURL()}/stat/sources`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

/////////////////// BEGIN /////////////////////////
/////////////////// ITEMS       ///////////////////
/////////////////// ITEMS       ///////////////////
export function FetchItems() {
    var FetchURL = `${APIURL()}/item`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function FetchItemsStock() {
    var FetchURL = `${APIURL()}/item/stock`;
    console.log( FetchURL );

    return fetch(FetchURL)
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}

export function InsertItem( jsonData ) {
    var FetchURL = `${APIURL()}/item`;
    console.log(JSON.stringify(jsonData));

    return fetch(FetchURL, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(resp => {
        return resp
    })
    .catch(err => {
        return err
    })
}
