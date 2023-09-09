class kpiColorByRate {
  constructor(number) {
    this.number = number;
  }
  getColor() {
    let num = +this.number;
    if(num < 50) return "#D32A2A"
    else if(num >= 50 && num < 70) return "#D59F29"
    else if(num >= 70 && num <= 100) return "#23cdb2"
    else return "#4096c4"
  }
  getDarkColor() {
    let num = +this.number;
    if(num < 50) return "#a32A2A"
    else if(num >= 50 && num < 70) return "#c58F09"
    else if(num >= 70 && num <= 100) return "#13ada2"
    else return "#3086b4"
  }
}

export default kpiColorByRate;