export function NumberWithDots(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function FormatDate(d) {
    var t = d.split(/[- : T Z]/);
    var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

    var monthNames = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    // return day + ' de ' + monthNames[monthIndex] + ' de ' + year;
    return (day+1).toString() + '/' + (monthIndex+1).toString() + '/' + year;
}

export function FormatDateTime(d) {
    var t = d.split(/[- : T E]/);
    var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

    var monthNames = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return (day+1).toString() + ' de ' + monthNames[monthIndex] + ' de ' + year + ', ' + hours + ':' + (minutes < 10 ? '0'+minutes : minutes) + ' hrs.';
}

export function FormatDiscount(x, d){
    return "$"+NumberWithDots(Math.round(x*(1-d/100)))
}
