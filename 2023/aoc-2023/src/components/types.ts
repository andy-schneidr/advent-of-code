
export type Result = {
    name: string;
    output1: string | number;
    output2: string | number;
    expected1: string | number;
    expected2: string | number;
    duration1?: number;
    duration2?: number;
    input: string[];
};
