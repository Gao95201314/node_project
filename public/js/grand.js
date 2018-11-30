var addgrand = document.getElementsByClassName('addgrand')[0];
var filter = document.getElementsByClassName('filter')[0];
var sure = document.getElementById('sure');
var no = document.getElementById('no');
addgrand.onclick = function() {
    filter.style.display = "block";
}
sure.onclick = function() {
    filter.style.display = "none";
}
no.onclick = function() {
    filter.style.display = "none";
}