
//update cart item using key and qty. key means key, id or others
async function updateCartUsingFetch(key, qty) {
    let formData = {
       'updates': {
           [key]: qty
       }
   }

   let config = {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify(formData)
   }

   let response = await fetch('/cart/update.js', config)
   let json = await response.text()
   this.updateCart()
 }

 // add cart item with extra propartise

    const formData = {
       'items': [{
        'id': variantId,
        'quantity': 1,
        'properties': {
           'title': 'Free Product'
         }
        }]
      }
 
    function addFreeProductToCart(formData){
        fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        })
        .then(response => response.json())
    .then(response => console.log(response))
        .catch((error) => console.error('Error:', error));
    }