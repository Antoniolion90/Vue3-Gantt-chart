import dayjs from "dayjs";
import Mock from "mockjs";

const colorList = [
    "(252, 105, 100)",
    "(247, 167, 71)",
    "(116, 202, 90)",
    "(83, 186, 241)",
    "(208, 142, 2231)"
];
const nameList = "Надежда,Крыло,Свет,Снуп,Лишен,Полицейский,Метеор молнии,Доктор,Громовержец Вулкан,Снайпер,Свет надежды,Наньхайский ниндзя,Rapid E3,HMS Mountain God,Охранник,Молот,Именинница,Звезда,Романска,Желание,Молния,Пожарный,Евростар".split(
    ","
);

const typeList = "🚅,🚈,🚄".split(",");

const Random = Mock.Random;
let colNum = 10;
let times = [new Date(2024, 6, 10, 10, 10), new Date(2024, 6, 11, 10, 10)];


function generateRow() {
    let rowId = "JHR" +
        Random.natural(100, 999) +
        Random.character("upper") +
        Random.character("upper");
    let rowType = Random.pick(typeList);
    let rowSpeed = Random.natural(0, 200);
    let template = {
        name: () => Random.pick(nameList),
        id: rowId,
        type: rowType,
        speed: rowSpeed,
        colorPair: () => {
            let a = "rgb" + Random.pick(colorList);
            return {
                dark: a.replace(")", ",0.8)"),
                light: a.replace(")", ",0.1)")
            };
        },
        gtArray: () => {
            let temp = [];
            let i = 0;
            let j = Random.natural(colNum - 1, colNum);
            let tempStart = dayjs(times[0]);
            let tempEnd = dayjs(times[0]);

            while (i < j) {
                tempStart = tempEnd.add(Random.natural(1, 6), "hour");
                tempEnd = tempStart.add(Random.natural(2, 6), "hour");
                temp.push({
                    id:
                        Random.character("upper") +
                        Random.character("upper") +
                        Random.natural(1000, 9999),
                    passenger: Random.natural(10, 200),
                    start: tempStart.toString(),
                    end: tempEnd.toString(),
                    type: rowType,
                    parentId: rowId
                });

                i++;
            }
            return temp;
        }
    };
    return Mock.mock(template)

}

export function mockDatas(nums, col, t) {
    colNum = col;
    times = t;
    let datas = [];
    for (let i = 0, j = Random.natural(nums, nums); i < j; i++) {
        datas.push(Object.assign({rawIndex: i}, generateRow()));
    }
    return datas;
}
