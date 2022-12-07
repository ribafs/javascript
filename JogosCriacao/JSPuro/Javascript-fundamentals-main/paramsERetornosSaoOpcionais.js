function area(altura, largura){
    const area = altura * largura
    if(area > 20){
        console.log(`valor acima do permitido: ${area}m2`)
    }else{
        return area
        
    }
}


area(4, 2)