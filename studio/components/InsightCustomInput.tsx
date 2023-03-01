// /components/MyCustomStringInput.jsx
import { useCallback } from 'react'
import { Stack, Text, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'

export const InsightCustomInput = (props: any) => {
    const { elementProps, onChange, value = '' } = props

    const handleChange = useCallback((event: any) => {
        console.log()
        const target = event.currentTarget;
        const nextValue = event.currentTarget.value;
        target.style.color = 'green';
        if(value.length > 20){
            target.style.color = 'red';
        }
        onChange(nextValue ? set(nextValue) : unset())
    }, [onChange])

    return (
        <Stack space={2}>
            <TextInput
                {...elementProps}
                onChange={handleChange}
                value={value}
            />
        </Stack>
    )
}