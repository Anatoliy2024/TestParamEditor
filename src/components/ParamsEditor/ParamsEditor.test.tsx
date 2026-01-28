import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ParamEditor from "./ParamsEditor"
import React from "react"
import type { Param, Model } from "./ParamsEditor"

const params: Param[] = [
  {
    id: 1,
    name: "Назначение",
    type: "string",
  },
  {
    id: 2,
    name: "Длина",
    type: "string",
  },
]

const model: Model = {
  paramValues: [
    {
      paramId: 1,
      value: "повседневное",
    },
    {
      paramId: 2,
      value: "макси",
    },
  ],
  colors: [],
}

describe("Проверка", () => {
  const renderEditor = () => {
    const ref = React.createRef<ParamEditor>()
    render(<ParamEditor ref={ref} params={params} model={model} />)
    return ref
  }

  it("присутствие значений", () => {
    renderEditor()

    expect(screen.getByText("Назначение")).toBeInTheDocument()
    expect(screen.getByText("Длина")).toBeInTheDocument()
  })

  it("отображает начальные значения", () => {
    renderEditor()

    expect(screen.getByDisplayValue("повседневное")).toBeInTheDocument()
    expect(screen.getByDisplayValue("макси")).toBeInTheDocument()
  })

  it("Проверка на изменение", () => {
    renderEditor()

    const input = screen.getByDisplayValue("макси")
    fireEvent.change(input, { target: { value: "мини" } })
    expect(input).toHaveValue("мини")
    const inputTwo = screen.getByDisplayValue("повседневное")
    fireEvent.change(inputTwo, { target: { value: "редкое" } })
    expect(inputTwo).toHaveValue("редкое")
  })

  it("Проверка получения новых данных используя getModel()", () => {
    const ref = renderEditor()

    const input = screen.getByDisplayValue("повседневное")
    fireEvent.change(input, { target: { value: "редкое" } })

    const inputTwo = screen.getByDisplayValue("макси")
    fireEvent.change(inputTwo, { target: { value: "мини" } })

    const result = ref.current!.getModel()

    expect(result).toEqual({
      colors: [],
      paramValues: [
        {
          paramId: 1,
          value: "редкое",
        },
        {
          paramId: 2,
          value: "мини",
        },
      ],
    })
  })
})
