<h1 align="center">Vue3-Gantt-chart</h1>

## 

Based on [Vue3-Gantt-chart](https://github.com/w1301625107/Vue-Gantt-chart) the changes are as follows:

-  Style adjustment, adding time scale grid at the top and date on the left. The scrolling plug-in is implemented using [iscroll](https://github.com/cubiq/iscroll), which keeps the scroll bar style consistent across browsers and supports dragging with the mouse, similar to the scrolling effect on mobile phones.

-  Data grouping: Gantt rows with different attributes can be grouped. After grouping, the data rendering is also dynamic, that is, only the data in the browser viewport is rendered. I tested 10,000-level data (500 rows and 25 columns) on this machine and it was slightly laggy.

-  Data search: After searching, highlight the results and scroll to the corresponding task location. If multiple results are found, continue to click the search button to jump to the next result.

-  Gantt block drag and drop adjustment: implemented based on the browser's native drag and drop event. Gantt blocks between different rows can be dragged and adjusted. Some verification can be done during adjustment. The code only performs time verification for the time being. After dragging, By default, there will be a black shadow block showing the original task. It can be set not to be displayed in the configuration item. You can also choose to display or not display the adjustment confirmation pop-up window (not displayed by default).

-  Right-click menu: If the vertical spacing of the rows you want to adjust is too large to be convenient for dragging, you can use the right-click menu to adjust the task, and you can choose to copy or swap.


### demo: [Online demo](https://liyang5945.github.io/vue-drag-gantt-chart)

### Animation demonstration
Drag and move

![](screenshot/vue_drag_gantt_1.gif)

Search

![](screenshot/vue_drag_gantt_3.gif)


Data format, the data of each row is as follows. The rawIndex field is the original order of each row, which is used to determine the vertical position (calculate the top value of absolute positioning). The gtArray contains the data of each small block.

```json

{
  "rawIndex": 2,
  "id": "JHR725ST",
  "type": "🚄",
  "speed": 88,
  "name": "警官号",
  "colorPair": {
    "dark": "rgb(247, 167, 71,0.8)",
    "light": "rgb(247, 167, 71,0.1)"
  },
  "gtArray": [
    {
      "id": "UM4366",
      "passenger": 40,
      "start": "Tue, 31 May 2022 21:00:28 GMT",
      "end": "Wed, 01 Jun 2022 02:00:28 GMT",
      "type": "🚄",
      "parentId": "JHR725ST"
    },
    {
      "id": "RA6062",
      "passenger": 120,
      "start": "Wed, 01 Jun 2022 06:00:28 GMT",
      "end": "Wed, 01 Jun 2022 10:00:28 GMT",
      "type": "🚄",
      "parentId": "JHR725ST"
    },
    {
      "id": "TR8476",
      "passenger": 52,
      "start": "Wed, 01 Jun 2022 15:00:28 GMT",
      "end": "Wed, 01 Jun 2022 20:00:28 GMT",
      "type": "🚄",
      "parentId": "JHR725ST"
    },
    {
      "id": "VX5715",
      "passenger": 44,
      "start": "Wed, 01 Jun 2022 23:00:28 GMT",
      "end": "Thu, 02 Jun 2022 04:00:28 GMT",
      "type": "🚄",
      "parentId": "JHR725ST"
    }
  ]
}

```
