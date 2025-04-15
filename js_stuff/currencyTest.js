const value = 2500781;
let IndonesianRupiah = new Intl.NumberFormat('id', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
console.log(IndonesianRupiah.format(value));