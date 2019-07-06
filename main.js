(function () {
    let myInput = document.getElementById('my-input');
    let resP = document.getElementById('res');
    let box = document.getElementById('box');
    let selectTable =  document.getElementById('select-table');
    let currentIndex;
    let currentTable;



    let Ratio = function (number, coeff) {
        this.number = number;
        this.coeff = coeff;
    };

    let tables = [
        {tableName: 'Табл.6.9',
        docName: 'СП 31-110-2003',
        ratios: [
            new Ratio(1, 1),
            new Ratio(2, 1),
            new Ratio(3, 0.9),
            new Ratio(5, 0.8),
            new Ratio(8, 0.75),
            new Ratio(10, 0.7),
            new Ratio(15, 0.65),
            new Ratio(20, 0.65),
            new Ratio(30, 0.55),
            new Ratio(50, 0.55),
            new Ratio(100, 0.55),
            new Ratio(200, 0.5)
        ]},
        {tableName: 'Табл.xx',
        docName: 'СП xx',
        ratios: [
            new Ratio(1, 1),
            new Ratio(2, 1),
            new Ratio(3, 0.9),
            new Ratio(5, 0.8),
            new Ratio(8, 0.75),
            new Ratio(10, 0.7),
            new Ratio(15, 0.65),
            new Ratio(20, 0.65)
        ]},
    ];

    function addTablesToSelect(tables) {
        for (let i = 0; i < tables.length; i++){
            let option = document.createElement('option');
            let text = document.createTextNode(tables[i].tableName);
            option.appendChild(text);
            option.value = i;
            selectTable.appendChild(option);
        }
    }



    addTablesToSelect(tables);

    function setCurrentTable() {
        currentIndex = 0;
        if (localStorage.getItem('selectedOption')){
            currentIndex = Number(JSON.parse(localStorage.getItem('selectedOption')));
        }
        currentTable = tables[currentIndex].ratios;
        let options = selectTable.getElementsByTagName('option');
        console.log(options);
        for (let i = 0; i < options.length; i++){
            if (i === currentIndex) {
                options[i].selected = true;
            }
        }

    }

    setCurrentTable();



    selectTable.onchange = function () {
        let index = selectTable.value;
        localStorage.setItem('selectedOption', JSON.stringify(index));
        currentTable = tables[index].ratios;
        resP.innerHTML = tableInterpolation(myInput.value, currentTable);


    };


    myInput.onkeyup = function () {
        let currentValue = myInput.value;

        resP.innerHTML = tableInterpolation(currentValue, currentTable);

    };

    function tableInterpolation(currentValue, ratios) {

        if(currentValue === ''){
            return '';
        }

        for (let i=1; i < ratios.length; i++){

            let lowerValue = ratios[i - 1].number;
            let higherValue = ratios[i].number;

            if(currentValue >= ratios[0].number && currentValue <= ratios[ratios.length-1].number){
                if (currentValue >= lowerValue && currentValue <= higherValue) {
                    let res = rangeInterpolation(ratios[i - 1], currentValue, ratios[i]);

                    return res;

                    break
                }
            }

        }

        return 'Число вне диапазона';

    }
    

    function rangeInterpolation(lowerRatio, currentValue, higherRatio) {
        let res = lowerRatio.coeff + ((currentValue - lowerRatio.number)/(higherRatio.number - lowerRatio.number))*
            (higherRatio.coeff - lowerRatio.coeff);

        console.log('------------');
        console.log(lowerRatio.number + ' | ' + currentValue + ' | ' + higherRatio.number);
        console.log(lowerRatio.coeff + ' | ' + res.toFixed(2) + ' | ' + higherRatio.coeff);
        console.log('------------');
        return res.toFixed(2);

    }

})();