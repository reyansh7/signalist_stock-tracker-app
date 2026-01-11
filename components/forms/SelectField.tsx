import React from 'react'
import { Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const SelectField = ({name,label,placeholder,options,control,error,required=false}:SelectFieldProps) => {
  return (
    <div className="space-y-2">
        <label htmlFor={name} className="form-label">{label}</label>
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? `Please Select ${label.toLocaleLowerCase()}` : false,
            }}
            render={({field}) => (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-600 text-white">
                        {options.map((option) => (
                            <SelectItem value={option.value} key={option.value} className="focus:bg-gray-600 focus:text-white">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                </Select>
            )}
        />
    </div>
  )
}

export default SelectField