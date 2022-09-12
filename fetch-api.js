
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