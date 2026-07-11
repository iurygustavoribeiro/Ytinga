import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SelectDemo } from "@/components/ui/app-select"

export function InputFieldValueRegister() {
  return (
    <>
    <Field>
      <FieldLabel htmlFor="input-field-measure_type">Tipo da medida</FieldLabel>
      <SelectDemo/>
    </Field>
    <Field>
      <FieldLabel htmlFor="input-field-measure_value">Valor</FieldLabel>
      <Input
        id="input-field-measure_value"
        type="text"
        placeholder="Insira o valor da medida"
      />
      <FieldDescription>
        Certifique-se de registrar um valor decimal coerente com o experimento realizado. Ex: 19,8.
      </FieldDescription>
    </Field>
  </>
  )
}

export function InputFieldStateCity() {
    return (<>
         <Field>
      <FieldLabel htmlFor="input-field-state">Estado</FieldLabel>
      <Input
        id="input-field-state"
        type="text"
        placeholder="Insira o estado"
      />
    </Field>
    <Field>
      <FieldLabel htmlFor="input-field-city">Cidade</FieldLabel>
      <Input
        id="input-field-city"
        type="text"
        placeholder="Insira a cidade"
      />
    </Field>
  </>
  )
}