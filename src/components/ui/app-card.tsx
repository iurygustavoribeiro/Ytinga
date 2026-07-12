import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InputFieldCityState, InputFieldValueRegister } from "./app-input"

export function CardRegister() {
  return (<Card>
  <CardHeader>
    <CardTitle>Registrar Medições</CardTitle>
    <CardDescription>Preencha os campos abaixo com o nome da medição realizada e o valor obtido para registrar manualmente no banco de dados</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <InputFieldValueRegister/>
  </CardContent>
  <CardFooter>
  <p>Medidas incorretas registradas com o intuito de fraudar o banco de dados serão punidas rigorosamente!</p>
  </CardFooter>
</Card>)
}

export function CardCityState() {
  return (<Card>
  <CardHeader>
    <CardTitle>Registrar Medições</CardTitle>
    <CardDescription>Preencha os campos abaixo com o nome da medição realizada e o valor obtido para registrar manualmente no banco de dados</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <InputFieldCityState/>
  </CardContent>
  <CardFooter>
  <p>Medidas incorretas registradas com o intuito de fraudar o banco de dados serão punidas rigorosamente!</p>
  </CardFooter>
</Card>)
}