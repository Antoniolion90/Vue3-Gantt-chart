import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            filterBlockId: "",
            currentBlock: {},
            currentRow: {},
            cutBlock: {},
            cutRow: {},
            targetBlock: {},
            targetRow: {},
            handleBlock: {},
            handleRow: {},
            showRowList: [],
            rawRowList: [],
            showMovedBlock: true,
            showDragConfirm: false
        }
    },
    mutations: {
        setFilterBlockId(state, str) {
            state.filterBlockId = str;
        },
        setCurrentBlock(state, object) {
            state.currentBlock = object;
        },
        setCurrentRow(state, object) {
            state.currentRow = object;
        },
        setCutBlock(state, object) {
            state.cutBlock = object;
        },
        setCutRow(state, object) {
            state.cutRow = object;
        },
        setTargetBlock(state, object) {
            state.targetBlock = object;
        },
        setTargetRow(state, object) {
            state.targetRow = object;
        },
        setHandleBlock(state, object) {
            state.handleBlock = object;
        },
        setHandleRow(state, object) {
            state.handleRow = object;
        },
        setShowRowList(state, object) {
            state.showRowList = object;
        },
        setRawRowList(state, object) {
            state.rawRowList = object;
        },
        setShowMovedBlock(state, bool) {
            state.showMovedBlock = bool;
        },
        setShowDragConfirm(state, bool) {
            state.showDragConfirm = bool;
        }
    }
});

export default store;