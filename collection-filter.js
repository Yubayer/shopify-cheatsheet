class ProductFilter extends HTMLElement{
    constructor(){
      super()
    }
  
    connectedCallback() {
      this.handleEvent()
      this.priceGap = 200
      this.timer
    }
  
    async handleEvent(){
      this.inputs = this.querySelectorAll(".product-filter")
      this.inputs.forEach(input => input.addEventListener("change", this.handleFilter.bind(this)))
      this.rangeInput = this.querySelectorAll(".range-input input")
      this.rangeInput.forEach(input => input.addEventListener("input", this.rangeSlider.bind(this)))
      this.priceInput = this.querySelectorAll(".price-input input")
      this.priceInput.forEach(input => input.addEventListener("input", this.handlePrice.bind(this)))
      this.range = this.querySelector(".slider .progress")
    }
  
    handlePrice(e) {
      let minPrice = parseInt(this.priceInput[0].value),
        minName = this.priceInput[0].name,
        maxPrice = parseInt(this.priceInput[1].value),
        maxName = this.priceInput[1].name
  
        let data = {
            min: {
              name: minName,
              value: minPrice
            },
            max: {
              name: maxName,
              value: maxPrice
            }
          }
  
        this.debounce(() => {
          this.updateSearchParamsPrice(data)
        }, 600).call()
        
        if((maxPrice - minPrice >= this.priceGap) && maxPrice <= this.rangeInput[1].max){
            if(e.target.className === "input-min"){
                this.rangeInput[0].value = minPrice;
                this.range.style.left = ((minPrice / this.rangeInput[0].max) * 100) + "%";
            }else{
                this.rangeInput[1].value = maxPrice;
                this.range.style.right = 100 - (maxPrice / this.rangeInput[1].max) * 100 + "%";
            }
        }
    }
    
    rangeSlider(e) {
      let minVal = parseInt(this.rangeInput[0].value),
        maxVal = parseInt(this.rangeInput[1].value),
        minName = this.rangeInput[0].name,
        maxName = this.rangeInput[1].name
  
        let data = {
            min: {
              name: minName,
              value: minVal
            },
            max: {
              name: maxName,
              value: maxVal
            }
          }
  
        this.debounce(() => {
          this.updateSearchParamsPrice(data)
        }, 1000).call()
        
        if((maxVal - minVal) < this.priceGap){
            if(e.target.className === "range-min"){
                this.rangeInput[0].value = maxVal - this.priceGap
            }else{
                this.rangeInput[1].value = minVal + this.priceGap;
            }
        }else{
            this.priceInput[0].value = minVal;
            this.priceInput[1].value = maxVal;
            this.range.style.left = ((minVal / this.rangeInput[0].max) * 100) + "%";
            this.range.style.right = 100 - (maxVal / this.rangeInput[1].max) * 100 + "%";
        }
    }
  
    async fetchingData(new_url) {
      const response = await fetch(new_url)
      const html = await response.text()
      
      document.getElementById("filterExceptPrice").innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById("filterExceptPrice").innerHTML
      document.getElementById("productGridX").innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById("productGridX").innerHTML
      
      await this.handleEvent()
    }
  
    handleFilter(e) {
      let name  =e.target.name
      let value = e.target.value
      this.updateSearchParams(name, value, e.target.checked)
    }
  
    updateSearchParamsPrice(data){
      console.log(data.min, data.max)
      let url = new URL(location.href)
      var search_params = url.searchParams;
      search_params.set(data.min.name, data.min.value);
      search_params.set(data.max.name, data.max.value);
      url.search = search_params.toString();
      var new_url = url.toString();
      window.history.pushState({}, '', new_url);
  
      this.fetchingData(new_url)
    }
  
    updateSearchParams(name, value, checked) {
      let url = new URL(location.href)
      var search_params = url.searchParams;
  
      if(checked){
        search_params.append(name, value);
      } else {
        let items = []
        for (const [key, v] of search_params.entries()) {
          if(key === name && v !== value)items.push([key,v])
        }
        search_params.delete(name)
        items.forEach((item)=>search_params.append(...item))
      }
      
      url.search = search_params.toString();
      var new_url = url.toString();
      window.history.pushState({}, '', new_url);
  
      this.fetchingData(new_url)
    }
  
    debounce(fn, wait) {
      return (...args) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          fn.apply(this, args)
        }, wait);
      };
    }
  }
  
  customElements.define("filter-component", ProductFilter)
  