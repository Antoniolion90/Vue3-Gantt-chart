<template>
  <div id="app">
    <div class="page-head">
      <h2 class="sub-title">Перетащите диаграмму Ганта</h2>
      <div class="operation-box">
        <span class="form-title">время:</span>
        <el-date-picker
            v-model="times"
            type="daterange"
            start-placeholder="Дата начала"
            end-placeholder="Дата окончания"
            style="width: 220px"
        >
        </el-date-picker>
        <span class="form-title">Строки:</span>
        <ElInput
            v-model.number="rowNum"
            style="width:60px"
        />
        <span class="form-title">Число столбцов:</span>
        <ElInput
            v-model.number="colNum"
            style="width:60px"
        />
        <ElButton type="primary" @click="initData">Генерация данных</ElButton>
        <ElInput
            v-model="searchValue"
            placeholder="серийный номер"
            clearable
            prefix-icon="el-icon-search"
            style="width: 120px"
            @clear="clearSearch"
        />
        <ElButton type="primary" @click="filterSearchValue">поиск
          <template v-if="findList.length">
            {{ `${currentFindIndex + 1}/${findList.length}` }}
          </template>
        </ElButton>
      </div>
      <el-popover
          placement="right"
          width="400"
          trigger="click">
        <div class="gantt-config-options">
          <el-form :inline="true" size="small">
            <el-form-item label="высота строки">
              <el-slider
                  v-model="cellHeight"
                  :min="20"
                  :max="100"
                  style="width:80px"
                  size="small"
              ></el-slider>
            </el-form-item>
            <el-form-item label="ширина единицы измерения">
              <el-slider
                  v-model="cellWidth"
                  :min="20"
                  :max="100"
                  style="width:80px"
                  size="small"
              ></el-slider>
            </el-form-item>
            <el-form-item label="продолжительность за тик">
              <el-select
                  v-model="scale"
                  placeholder=""
                  style="width:100px"
                  size="small"
              >
                <el-option
                    v-for="item in scaleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="hideHeader">спрятать голову</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox :value="showMovedBlock" @change="setShowMovedBlock"
                           title="Отображать ли блок Ганта перед перетаскиванием. Если этот флажок установлен, он будет отображаться в виде черной тени.">
                Показать задачи предварительной настройки
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox :value="showDragConfirm" @change="setShowDragConfirm"
                           title="Отображать ли всплывающее окно подтверждения при настройке задач">
                Показать всплывающее окно подтверждения корректировки
              </el-checkbox>
            </el-form-item>
          </el-form>

        </div>
        <el-button slot="reference" type="primary" style="margin-left: 10px;">Элементы конфигурации диаграммы Ганта
        </el-button>
      </el-popover>

    </div>
    <div class="page-body">
      <v-gantt-chart
          :currentTime="currentTime"
          :startTime="times[0]"
          :endTime="times[1]"
          :cellWidth="cellWidth"
          :cellHeight="cellHeight"
          :timeLines="timeLines"
          :titleHeight="titleHeight"
          :scale="scale"
          :titleWidth="titleWidth"
          showCurrentTime
          :hideHeader="hideHeader"
          :dataKey="dataKey"
          :datas="datas"
      >
      </v-gantt-chart>

    </div>
    <ElDialog
        title="Корректировка задачи"
        :visible.sync="checkDialogVisible"
        width="1000px">

      <check-adjust ref="checkAdjust" @closeDialog="checkDialogVisible=false"/>

    </ElDialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {cloneDeep} from "lodash";
import {mapMutations, mapState} from "vuex";
import checkAdjust from "./components/demo/checkAdjust.vue";
import {
  getWidthAbout2Times as _getWidthAbout2Times
} from "@/utils/gtUtils.js";
import {checkConflict} from "@/utils/tool.js";
import {mockDatas} from "@/api/mock-data";
import emitter from 'tiny-emitter/instance'

const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360,720,1440,2880,4320`
    .split(",")
    .map(n => {
      let value = parseInt(n);
      let label;
      if (value < 60) {
        label = value + "minute";
      } else if (value >= 60 && value < 1440) {
        label = value / 60 + "hour";
      } else {
        label = value / 1440 + "day";
      }
      return {
        value,
        label
      };
    });
export default {
  name: "App",
  components: {checkAdjust},
  data() {
    return {
      searchValue: "",
      timeLines: [
        {
          time: dayjs()
              .add(2, "hour")
              .toString(),
          text: "~~"
        },
        {
          time: dayjs()
              .add(5, "hour")
              .toString(),
          text: "try",
          color: "#747E80"
        }
      ],
      currentTime: dayjs(),
      cellWidth: 60,
      cellHeight: 50,
      titleHeight: 60,
      titleWidth: 250,
      scale: 60,
      times: [
        dayjs()
            .set("hour", 0)
            .set("minute", 0)
            .toString(),
        dayjs()
            .add(6, "day")
            .set("hour", 23)
            .set("minute", 59)
            .toString()
      ],
      rowNum: 500,
      colNum: 25,
      datas: [[]],
      dataKey: "id",
      scaleList: scaleList,
      scrollToTime: dayjs()
          .add(1, "day")
          .toString(),
      hideHeader: false,
      positionB: {},
      positionA: {},
      ganttData: [],
      classifyDialogVisible: false,
      checkDialogVisible: false,
      rowTypes: ["🚅", "🚈", "🚄"],
      speedTypes: ["0~50", "50~100", "100"],
      selectRowTypes: [],
      selectSpeedTypes: [],
      classifyTypeList: [],
      rawData: [],
      findList: [],
      currentFindIndex: 0
    };
  },
  watch: {
    showRowList() {
      this.classifyData();
    },
    cellWidth() {
      setTimeout(() => {
        emitter.emit("refresh");
      }, 500)
    },
    scale() {
      setTimeout(() => {
        emitter.emit("refresh");
      }, 500)
    }
  },
  computed: {
    ...mapState([
      "filterBlockId",
      "currentBlock",
      "currentRow",
      "targetBlock",
      "targetRow",
      "showRowList",
      "rawRowList",
      "showMovedBlock",
      "showDragConfirm"
    ])
  },
  mounted() {
    this.initData();
    emitter.on("updateTimeLines", (timeParam) => {
      this.updateTimeLines(timeParam.start, timeParam.end);
    });

    emitter.on("toggleGroupOpen", (index) => {
      this.toggleGroupOpen(index);
    });

    emitter.on("updateCurrentTime", (time) => {
      this.currentTime = time
    });
    emitter.on("dragTask", () => {
      this.dragTask();
    });

  },
  methods: {
    ...mapMutations([
      "setFilterBlockId",
      "setCurrentBlock",
      "setCurrentRow",
      "setCutBlock",
      "setCutRow",
      "setShowRowList",
      "setRawRowList",
      "setShowMovedBlock",
      "setShowDragConfirm"
    ]),
    getWidthAbout2Times(start, end) {
      const options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return _getWidthAbout2Times(start, end, options);
    },
    initData() {
      let list = mockDatas(this.rowNum, this.colNum, this.times);
      this.setRawRowList(list);
      this.setShowRowList(cloneDeep(list));
      this.classifyData();
    },
    updateTimeLines(timeA, timeB) {
      this.timeLines = [
        {
          time: timeA,
          text: "настроить"
        },
        {
          time: timeB,
          text: "тест",
          color: "#747E80"
        }
      ];
    },

    classifyData() {

      function combine(arr) {
        let result = [];
        (function f(t, a, n) {
          if (n === 0) return result.push(t);
          for (let i = 0; i < a[n - 1].length; i++) {
            f(t.concat(a[n - 1][i]), a, n - 1);
          }
        })([], arr, arr.length);
        return result;
      }

      let typeList = this.selectRowTypes.length ? this.selectRowTypes : [""];
      let speedList = this.selectSpeedTypes.length ? this.selectSpeedTypes : [""];

      let resultArr = combine([typeList, speedList]);
      let classifyList = [];
      resultArr.forEach(resultItem => {

        let tempObj = {};
        if (resultItem[0]) {
          tempObj["speed"] = resultItem[0];
        }
        if (resultItem[1]) {
          tempObj["type"] = resultItem[1];
        }
        if (Object.getOwnPropertyNames(tempObj).length) {
          classifyList.push(tempObj);
        }

      });
      this.classifyTypeList = classifyList;
      if (!classifyList.length) {
        this.datas = [
          {
            groupType: {},
            children: cloneDeep(this.showRowList),
            isOpen: true
          }
        ];
        return false;
      }
      let groupList = [];

      classifyList.forEach(classifyItem => {
        let tempObj = Object.assign({}, classifyItem);
        tempObj["children"] = [];
        let blockRowList = cloneDeep(this.showRowList);
        for (let filterKey in classifyItem) {
          blockRowList = blockRowList.filter(bridgeItem => {
            if (filterKey === "speed") {
              let speedLimit = classifyItem[filterKey].split("~");
              if (speedLimit.length === 2) {
                return bridgeItem.speed >= speedLimit[0] && bridgeItem.speed < speedLimit[1];
              } else {
                return bridgeItem.speed >= speedLimit[0];
              }
            }
            return bridgeItem[filterKey] === classifyItem[filterKey];
          });
        }
        blockRowList.forEach((item, index) => {
          item.rawIndex = index;
        });
        tempObj["children"] = blockRowList;
        tempObj["groupType"] = classifyItem;
        tempObj["isOpen"] = true;
        groupList.push(tempObj);
      });
      this.datas = groupList;
      this.classifyDialogVisible = false;
    },

    filterSearchValue() {
      if (!this.searchValue) {
        this.$message.warning('Число не может быть пустым~');
        return false;
      }
      let findList = this.findList.length ? this.findList : [];

      if (findList.length) {
        this.currentFindIndex += 1;
        if (this.currentFindIndex >= findList.length) this.currentFindIndex = 0;
        for (let i = this.currentFindIndex, len = findList.length; i < len; i++) {
          let blockItem = findList[i];
          emitter.emit("scrollToPosition", {
            x: -blockItem.x,
            y: -blockItem.y
          });
          break;
        }
        return false;
      }
      let preScrollHeight = 0;

      for (let i = 0, len = this.datas.length; i < len; i++) {

        let ganttGroup = this.datas[i];
        ganttGroup.isOpen = true;
        let blockRowList = ganttGroup.children;


        let findRow = blockRowList.filter(row => {
          let blockItemIds = row.gtArray.map(blockItem => blockItem.id).join("~");
          return blockItemIds.includes(this.searchValue);
        });
        let scrollTop = 0;
        if (findRow.length) {

          for (let j = 0, len = findRow.length; j < len; j++) {
            let rowItem = findRow[j];
            scrollTop = (rowItem.rawIndex + 1) * this.cellHeight;

            let filterBlockList = rowItem.gtArray.filter(blockItem => {
              return blockItem.id.includes(this.searchValue);
            });
            if (filterBlockList.length) {
              filterBlockList.forEach(blockItem => {
                const containerWidth = window.innerWidth - this.titleWidth;

                let totalTimeWidth = this.getWidthAbout2Times(this.times[0], this.times[1]);

                let calcLeft = this.getWidthAbout2Times(this.times[0], blockItem.start); //

                let scrollLeft = calcLeft > totalTimeWidth - containerWidth ? totalTimeWidth - containerWidth : calcLeft;

                let newBlockItem = {
                  x: scrollLeft,
                  y: scrollTop + preScrollHeight,
                  ...blockItem
                };

                findList.push(newBlockItem);

              });
            }
          }
        } else {
          this.$message.warning('результатов не найдено~');
          return false;
        }
        preScrollHeight += (blockRowList.length + 1) * this.cellHeight;
      }
      this.findList = findList;
      emitter.emit("scrollToPosition", {
        x: -findList[0].x,
        y: -findList[0].y
      });
      this.setFilterBlockId(this.searchValue);
    },
    clearSearch() {
      this.setFilterBlockId('');
      this.currentFindIndex = 0;
      this.findList = [];
    },
    dragTask() {
      if (this.showDragConfirm) {
        this.checkAssign();
      } else {
        this.dragBlock();
      }
    },
    checkAssign() {
      this.checkDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.checkAdjust.calcConflictList();
      });
    },
    dragBlock() {
      let adjustList = [];
      if (this.targetRow && this.currentBlock) {
        let adjustOjb = checkConflict(this.currentBlock, this.targetRow, this.targetBlock ? this.targetBlock : null);
        adjustList.push(adjustOjb);
      }
      if (this.currentRow && this.targetBlock) {
        let adjustOjb = checkConflict(this.targetBlock, this.currentRow, this.currentBlock ? this.currentBlock : null);
        adjustList.push(adjustOjb);
      }

      let hasConflict = adjustList.some(adjustObj => {
        return adjustObj.conflictList.length > 0;
      });
      if (hasConflict) {
        this.$message.error("В задании на настройку имеется конфликт времени, проверьте! ");
      }
      let rowList = cloneDeep(this.showRowList);
      adjustList.forEach(adjustItem => {
        let currentRow = rowList.find(row => row.id === adjustItem.blockItem.parentId);

        if (this.showMovedBlock) {
          let movedBeforeBlock = currentRow.gtArray.find(blockItem => {
            return blockItem.id === adjustItem.blockId;
          });
          if (movedBeforeBlock["movedStatus"] === "after") {
            currentRow.gtArray = currentRow.gtArray.filter(blockItem => blockItem.id !== adjustItem.blockId);
          } else {
            movedBeforeBlock["movedStatus"] = "before";
          }
        } else {
          currentRow.gtArray = currentRow.gtArray.filter(blockItem => blockItem.id !== adjustItem.blockId);
        }
        let newBlock = cloneDeep(adjustItem.blockItem);
        let targetRow = rowList.find(row => row.id === adjustItem.targetRowId);
        newBlock["movedStatus"] = "after";
        newBlock["parentId"] = targetRow.id;
        targetRow.gtArray.push(newBlock);
      });
      this.setCutBlock(null);
      this.setCutRow(null);
      this.setShowRowList(rowList);
    },
    toggleGroupOpen(index) {
      this.datas[index].isOpen = !this.datas[index].isOpen;
    }

  }
};
</script>
