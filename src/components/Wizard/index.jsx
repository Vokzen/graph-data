import React, { useEffect, useState } from 'react'
import { useMultipleForm } from 'usetheform'
import ReactJson from 'react-json-view'
import axios from 'axios'

// Data
import questions from '~app/utils/questions'

// Components
import Form from '~app/components/Wizard/forms'

import { Container } from './styles'
import Gauge from '~app/components/ui/Gauge'
import TipoDePersona from '~app/components/Wizard/forms/TipoDePersona'
import SimpleFields from '~app/components/Wizard/forms/SimpleFields'
import DemandasLaborales from '~app/components/Wizard/forms/DemandasLaborales'
import NumeroEmpleados from '~app/components/Wizard/forms/NumeroEmpleados'
import { destroyItem, getItem, setItem } from '~app/utils/cookies'
import { calculateResult, mapWizardState } from '~app/utils/utils'
import ResultsCard from '~app/components/ui/ResultsCard'

const Wizard = () => {
  const [currentPage, setPage] = useState(1)
  const [wizardState, setWizardState] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState()

  const nextPageHandler = () => setPage((prev) => ++prev)
  const prevPageHandler = () => setPage((prev) => --prev)

  const [getWizardStatus, wizardApi] = useMultipleForm((state) => setWizardState(state))

  useEffect(() => {
    destroyItem('flags')
  }, [])

  const onSubmitWizard = async () => {
    setIsLoading(true)

    const wizardState = getWizardStatus()
    const state = mapWizardState(wizardState)

    const actualFlags = getItem('flags')
    const newResult = calculateResult(actualFlags)
    setResult(newResult)

    const { data } = await axios.post(
      '/api/airtable-post',
      { ...state, Flags: JSON.stringify(actualFlags) },
      { headers: { 'Content-Type': 'application/json' } },
    )

    setItem('airId', data.data?.records?.[0]?.id)
    setIsLoading(false)
  }

  const setFlagsHandler = (newFlag) => {
    const actualFlags = getItem('flags')
    setItem('flags', { ...actualFlags, ...newFlag })
  }

  if (isLoading) {
    return 'loading'
  }

  return (
    <Container>
      {!result && (
        <>
          <TipoDePersona
            className={currentPage !== 1 && 'notVisible'}
            form={questions.tipoDePersona}
            prevPageHandler={prevPageHandler}
            onSubmit={nextPageHandler}
            {...wizardApi}
          />
          <SimpleFields
            className={currentPage !== 2 && 'notVisible'}
            form={questions.datosPersonales}
            prevPageHandler={prevPageHandler}
            onSubmit={nextPageHandler}
            {...wizardApi}
          />
          <DemandasLaborales
            className={currentPage !== 3 && 'notVisible'}
            form={questions.demandasLaborales}
            prevPageHandler={prevPageHandler}
            onSubmit={nextPageHandler}
            setFlags={setFlagsHandler}
            {...wizardApi}
          />
          <NumeroEmpleados
            className={currentPage !== 4 && 'notVisible'}
            form={questions.numeroEmpleados}
            prevPageHandler={prevPageHandler}
            onSubmit={nextPageHandler}
            setFlags={setFlagsHandler}
            {...wizardApi}
          />
          <SimpleFields
            className={currentPage !== 5 && 'notVisible'}
            form={questions.contratoLaboral}
            prevPageHandler={prevPageHandler}
            onSubmit={nextPageHandler}
            setFlags={setFlagsHandler}
            {...wizardApi}
          />
          <SimpleFields
            className={currentPage !== 6 && 'notVisible'}
            form={questions.procesosAbiertos}
            prevPageHandler={prevPageHandler}
            onSubmit={onSubmitWizard}
            setFlags={setFlagsHandler}
            {...wizardApi}
          />
        </>
      )}

      {result && <Gauge values={result.values} />}
      {result && result.flags && (
        <div>
          <ResultsCard data={result.flags} color="red" />
          <ResultsCard data={result.flags} color="orange" />
          <ResultsCard data={result.flags} color="green" />
        </div>
      )}
    </Container>
  )
}

export default Wizard
