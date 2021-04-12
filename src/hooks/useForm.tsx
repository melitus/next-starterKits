import * as React from "react";

import isObjectEmpty from "@/utils/isObjectEmpty";

type InputType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type Submit = (input: { [key: string]: any }) => any;

interface IUseFormOutput {
    errors: { [key: string]: string };
    handleInputChange: <T extends InputType>(event: React.ChangeEvent<T>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void; 
    inputValues: { [key: string]: string };
    setInputValues: React.Dispatch<React.SetStateAction<any>>
}

const useForm = (initInputs: { [key: string]: any },    
    customSubmit: Submit,
    customValidation: (input: { [key: string]: string }) => any
    ): IUseFormOutput => {
    const [ inputValues, setInputValues ] = React.useState(initInputs);
    const [ errors, setErrors ] = React.useState<{ [key: string]: string }>({ errors: "" });
    const [ submitDisabled, setSubmitDisabled ] = React.useState(true);

    const handleInputChange = <T extends InputType>(event: React.ChangeEvent<T>) => {
        const { name: eventName, value: eventValue } = event.target;

        setInputValues({
            ...inputValues,
            [ eventName ]: eventValue
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(customValidation(inputValues));
    };

    React.useEffect(() => {
        const isError = isObjectEmpty(errors);

        if (isError && !submitDisabled) {
            customSubmit(inputValues);
        }

        setSubmitDisabled(false);

    }, [ errors ]);

    return {
        errors,
        handleInputChange,
        handleSubmit,
        inputValues,
        setInputValues
    };
};

export default useForm;