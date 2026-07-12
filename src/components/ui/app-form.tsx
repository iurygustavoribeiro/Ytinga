"use client"

import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Input } from "./input"

const formSchemaCityState = z.object({
  state: z.string().min(1, "Por favor, selecione um estado."),
  city: z.string().min(1, "Por favor, selecione uma cidade."),
})

const formSchemaMeasureRegister = z.object({
  measure_type: z.string().min(1, "Por favor, selecione um tipo de medida."),
  measure_value: z.string().min(1, "Por favor, insira um valor válido."),
  fountain_id: z.string().min(1, "Por favor, selecione uma fonte."),
})

const measure_types = [
  { label: "Selecione um tipo", value: "" },
  { label: "Dureza Total", value: "hardness" },
  { label: "Cloro Residual Livre", value: "frc" },
  { label: "Cloretos", value: "chloride" },
  { label: "Tubidez", value: "turbidity" },
  { label: "pH", value: "ph" },
  { label: "Temperatura", value: "temperature" },
]

export function FormCityState() {
  const [cities, setCities] = useState<{ label: string; value: number }[]>([])
  const [states, setStates] = useState<{ label: string; value: string }[]>([])
  const [selectedState, setSelectedState] = useState<string>("")
    
  // Carregar estados na montagem
  useEffect(() => {
    async function loadStates() { 
      try {
        const res_states = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        const data_states = await res_states.json()
        setStates(data_states.map((state: any) => ({
          label: state.nome,
          value: state.sigla,
        })))
      } catch (error) {
        console.error("Erro ao buscar estados:", error)
        setStates([])
      }
    }

    loadStates()
  }, [])

  // Carregar cidades quando o estado muda
  useEffect(() => {
    if (!selectedState) {
      setCities([])
      return
    }

    async function loadCities() {
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        const data = await res.json()
        setCities(data.map((city: any) => ({
          label: city.nome,
          value: city.id,
        })))
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
        setCities([])
      }
    }

    loadCities()
  }, [selectedState])
    
  const form = useForm({
    defaultValues: {
      state: "",
      city: "",
    },
    validators: {
      onSubmit: formSchemaCityState,
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre> // é aqui eu eu mexo para decidir o que fazer com os valores do formulário, por exemplo, enviar para o backend 
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      })
    },
  })

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Estado e Cidade</CardTitle>
        <CardDescription>
          Selecione um estado e a cidade desejada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-tanstack-select"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="state"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-select-state">
                        Estado
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        const nextValue = value ?? ""
                        field.handleChange(nextValue)
                        setSelectedState(nextValue)
                      }}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-state"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Selecione um estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem
                            key={state.value}
                            value={state.value}
                          >
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />

            <form.Field
              name="city"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-select-city">
                        Cidade
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                      disabled={!selectedState}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-city"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder={selectedState ? "Selecione uma cidade" : "Selecione um estado primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem
                            key={city.value}
                            value={String(city.value)}
                          >
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Resetar
          </Button>
          <Button type="submit" form="form-city-state">
            Buscar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export function FormMeasureRegister() {
    const [fountains, setFountains] = useState<{ label: string | null; value: number }[]>([])
  useEffect(() => {
    async function loadFountains() {
      try {
        // TODO: replace this placeholder data with a server API request.
        const placeholderFountains = [
          { label: "Fonte A", value: 1 },
          { label: "Fonte B", value: 2 },
          { label: "Fonte C", value: 3 },
        ]
        setFountains(placeholderFountains)
      } catch (error) {
        console.error("Erro ao buscar fountains:", error)
        setFountains([])
      }
    }
    loadFountains()
  }, [])

    const form = useForm({
    defaultValues: {
      measure_type: "",
      measure_value: "",
      fountain_id: "",
    },
    validators: {
      onSubmit: formSchemaMeasureRegister,
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre> // é aqui eu eu mexo para decidir o que fazer com os valores do formulário, por exemplo, enviar para o backend 
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      })
    },
  })
    
  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Registrar Medidas</CardTitle>
        <CardDescription>
          Registre as medições realizadas, incluindo o tipo de medida, valor e o bebedouro correspondente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-tanstack-select"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="measure_type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-select-measure_type">
                        Tipo de Medida
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-measure_type"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Selecione o tipo de medida" />
                      </SelectTrigger>
                      <SelectContent>
                        {measure_types.map((state) => (
                          <SelectItem
                            key={state.value}
                            value={state.value}
                          >
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />

            <form.Field
              name="measure_value"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-textarea-measure_value">
                        Valor
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <FieldLabel htmlFor="input-field-measure_value">Valor</FieldLabel>
                    <Input
                      id="input-field-measure_value"
                      type="text"
                      placeholder="Insira o valor da medida"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                    /> {/* tem que botar para a pessoa escolher o fountain_id também */}
                    <FieldDescription>
                        Certifique-se de registrar um valor decimal coerente com o experimento realizado. Ex: 19,8.
                    </FieldDescription>
                  </Field>
                )
              }}
            />

            <form.Field
              name="fountain_id"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="responsive" data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-tanstack-select-fountain_id">
                        ID do Bebedouro
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-fountain_id"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Selecione o ID do Bebedouro" />
                      </SelectTrigger>
                      <SelectContent>
                        {fountains.map((state) => (
                          <SelectItem
                            key={state.value}
                            value={String(state.value)}
                          >
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />

          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Resetar
          </Button>
          <Button type="submit" form="form-measure-register">
            Enviar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
