import React from "react"

export interface Param {
  id: number
  name: string
  type: "string"
}

interface ParamValue {
  paramId: number
  value: string
}

interface Color {}

export interface Model {
  paramValues: ParamValue[]
  colors: Color[]
}

interface Props {
  params: Param[]
  model: Model
}

interface State {
  paramValues: ParamValue[]
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const paramValues = props.params.map((param) => {
      const existing = props.model.paramValues.find(
        (pv) => pv.paramId === param.id
      )
      return existing || { paramId: param.id, value: "" }
    })

    this.state = { paramValues }
  }

  public getModel(): Model {
    return {
      paramValues: [...this.state.paramValues],
      colors: [...this.props.model.colors],
    }
  }

  private handleParamChange = (paramId: number, value: string): void => {
    this.setState((prevState) => ({
      paramValues: prevState.paramValues.map((pv) =>
        pv.paramId === paramId ? { paramId, value } : pv
      ),
    }))
  }

  private getParamValue(paramId: number): string {
    const paramValue = this.state.paramValues.find(
      (pv) => pv.paramId === paramId
    )
    return paramValue ? paramValue.value : ""
  }

  render() {
    return (
      <div className="param-editor">
        {this.props.params.map((param) => (
          <ParamRow
            key={param.id}
            param={param}
            value={this.getParamValue(param.id)}
            onChange={this.handleParamChange}
          />
        ))}
      </div>
    )
  }
}

interface ParamRowProps {
  param: Param
  value: string
  onChange: (paramId: number, value: string) => void
}

const ParamRow: React.FC<ParamRowProps> = ({ param, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(param.id, e.target.value)
  }

  const renderInput = () => {
    switch (param.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="param-input"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="param-row">
      <label className="param-label">{param.name}</label>
      {renderInput()}
    </div>
  )
}

const styles = `
    .wrapper{
         display:flex;
        flex-direction: column;
        justify-content: center; 
       
    }
  .param-editor {
    max-width: 600px;
    margin: 20px;
    font-family: Arial, sans-serif;
  }

  .param-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 15px;
  }

  .param-label {
    min-width: 150px;
    font-weight: 500;
    color: #333;
  }

  .param-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .param-input:focus {
    outline: none;
    border-color: #4a90e2;
  }
`

const ExampleUsage: React.FC = () => {
  const paramsRef = React.useRef<ParamEditor>(null)

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

  const handleGetModel = () => {
    if (paramsRef.current) {
      const currentModel = paramsRef.current.getModel()
      console.log("Текущая модель:", currentModel)
      alert(JSON.stringify(currentModel, null, 2))
    }
  }

  return (
    <div className="wrapper">
      <style>{styles}</style>
      <h2>Редактор параметров товара</h2>
      <ParamEditor ref={paramsRef} params={params} model={model} />
      <button
        onClick={handleGetModel}
        style={{ marginLeft: "20px", padding: "10px 20px" }}
      >
        Получить модель
      </button>
    </div>
  )
}

export default ParamEditor
export { ExampleUsage }
