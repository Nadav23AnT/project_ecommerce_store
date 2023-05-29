
bg = document.getElementsByClassName("bg");
//product = document.getElementsByClassName("product-link");

// asign event all links
document.querySelectorAll(".product-link").forEach(item => {
    item.addEventListener("click", event => {
        id = item.getAttribute("data-productid");

        productFull = document.getElementById( id );
        bg[0].style.display = "block";

        productFull.style.top = "50%";
    });
});

document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
		bg[0].style.display = "none";
        document.querySelectorAll(".full-product").forEach(productFull => {
            productFull.style.top = "-50%";
        });
	}
});