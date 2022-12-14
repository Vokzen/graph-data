import React from 'react'

import { ResultsCardContainer, ResultsCardContent, ResultsCardText } from './styles'

const Card = ({ title, data, color }) => data[color].length > 0 && (
  <ResultsCardContainer>
    <h2>{title}</h2>
    <ResultsCardContent color={color}>
      {data[color].map((item, idx) => (
        <ResultsCardText key={`${item}-${idx}`}>{item}</ResultsCardText>
      ))}
    </ResultsCardContent>
  </ResultsCardContainer>
)

const Results = ({ flags }) => (
  <div>
    <Card title='Resultados Críticos' data={flags} color='red' />
    <Card title='Resultados Intermedios' data={flags} color='orange' />
    <Card title='Resultados Buenos' data={flags} color='green' />
  </div>
)

export default Results
