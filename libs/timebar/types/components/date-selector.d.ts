export default DateSelector;
declare class DateSelector extends Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    pressing: number;
    pressingInterval: any;
    pressingTimeout: any;
    onMouseDown(increment: any): void;
    startTimeout: () => void;
    onInterval: () => void;
    onMouseUp: () => void;
    clear(): void;
}
declare namespace DateSelector {
    namespace propTypes {
        const onChange: any;
        const value: any;
        const canIncrement: any;
        const canDecrement: any;
    }
}
import { Component } from "react";
