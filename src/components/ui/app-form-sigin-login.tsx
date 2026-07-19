"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldContent
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useEffect, useState } from "react"
import { queryCities, queryStates } from "@/lib/IBGE/states-cities"
import { queryInstitutionsByCity } from "@/server/query/institutions"

const formSchema = z.object({
  email: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  password: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  institution: z.string(),
  state: z.string(),
  city: z.string(),
  role: z.string(),
  affiliation_proof: z.string(),
}) 

export function FormSignup() {
  const [cities, setCities] = useState<{ label: string; value: string }[]>([])
  const [states, setStates] = useState<{ label: string; value: string }[]>([])
  const [institutions, setInstitutions] = useState<{ label: string; value: string }[]>([])
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")

  useEffect(() => {
    async function loadStates() { 
      try {
        const res_states = await queryStates()
        setStates(res_states)
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
        const res = await queryCities(selectedState)
        setCities(res)
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
        setCities([])
      }
    }
    loadCities()
  }, [selectedState])

  useEffect(() => {
    async function loadInstitutions() {
      try {
        const res = await queryInstitutionsByCity()
        setInstitutions(
          res.map((institution: any) => ({
            label: institution.name ?? "Instituição",
            value: String(institution.id),
          }))
        )
      } catch (error) {
        console.error("Erro ao buscar   instituições:", error)
        setInstitutions([])
      }
    }
    loadInstitutions()
  }, [selectedCity])

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      state: "",
      city: "",
      institution: "",
      role: "",
      affiliation_proof: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
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
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>
          Cadastre-se para acessar o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="bug-report-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ex: iara@exemplo.com"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ex: 123456789 (não use essa!)"
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={isInvalid}
                      />
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="state"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
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
                      onValueChange={(value) => {
                        field.handleChange(value ?? "")
                        setSelectedCity(value ?? "")
                      }}
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
            <form.Field
              name="institution"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Instituição</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        const nextValue = value ?? ""
                        field.handleChange(nextValue)
                      }}
                    >
                      <SelectTrigger
                        id="form-tanstack-select-state"
                        aria-invalid={isInvalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Selecione uma cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem
                            key={institution.value}
                            value={institution.value}
                          >
                            {institution.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            />
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Digite o seu cargo na instituição."
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.state.value.length}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="affiliation_proof"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Comprovante de Afiliação</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="I'm having an issue with the login button on mobile."
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.state.value.length}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
          <Button type="submit" form="bug-report-form">
            Enviar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
