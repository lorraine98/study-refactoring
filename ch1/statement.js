const invoiceData = require('./invoices.json');
const playsData = require('./plays.json');

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;

    function playFor(aPerformance) {
        return plays[aPerformance.playId];
    }

    for (let perf of invoice.performances) {
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;

    return result;
}


function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
    }

    return result;
}

function volumeCreditsFor(aPerformace) {
    let result = 0;
    result += Math.max(aPerformace.audience - 30, 0);
    if ("comedy" === playFor(aPerformace).type) {
        result += Math.floor(aPerformace.audience / 5);
    }

    return result;
}

function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoiceData.performances) {
        result += volumeCreditsFor(perf);
    }

    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
}

function totalAmount() {
    let result = 0;
    for (let perf of invoiceData.performances) {
        totalAmount += amountFor(perf);
    }

    return result;
}

console.log(statement(invoiceData, playsData));