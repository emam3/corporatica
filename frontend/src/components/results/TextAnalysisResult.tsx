import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Stack, Typography } from '@mui/material'
import { TEXT_SERVICES } from '../../helpers/enum/home'
import { isValidImageUrl } from '../../helpers/functions/textData'
import { TypeAnimation } from 'react-type-animation'

export const TextAnalysisResult = () => {
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false)
  const results = useSelector((state: RootState) => state.apiRequest.textAnalysisResult)
  const services = useSelector((state: RootState) => state.apiRequest.requiredTextServices)

  useEffect(() => {
    const checkValidImg = async () => {
      const isValid = await isValidImageUrl(results.T_SNE_IMG)
      setIsValidUrl(isValid)
    }
    checkValidImg();
  }, [results.T_SNE_IMG]);

  return (
    <>
      {results?.classification && <>
        <Stack direction='row' gap={2} alignItems={'center'}>
          <Typography variant='h4'>classification : </Typography>
          <Typography
            fontSize={'20px'}
            color={results.classification === 'Positive' ? 'green' : 'red'}>
            <TypeAnimation
              sequence={[
                results.classification, 100
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: '2em', display: 'inline-block' }}
              repeat={0}
            />
          </Typography>
        </Stack>

      </>}

      {results?.summary && <>
        <Stack direction='row' gap={2} alignItems={'center'}>
          <Typography sx={{ textWrap: 'nowrap' }} variant='h4' alignItems={'baseline !important'} justifyContent={'flex-start'}>Summary : </Typography>

          <TypeAnimation
            sequence={[
              results.summary
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={0}
          />
        </Stack>

      </>}

      {results?.keywords && <>
        <Stack direction='row' gap={2} alignItems={'center'}>
          <Typography sx={{ textWrap: 'nowrap' }} variant='h4' alignItems={'baseline !important'} justifyContent={'flex-start'}>Keywords : </Typography>

          <TypeAnimation
            sequence={[
              results?.keywords?.toString()
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={0}
          />
        </Stack>

      </>}
      {(services.includes(TEXT_SERVICES.T_SNE)
        && isValidUrl)
        && <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <img width={'60%'} src={results.T_SNE_IMG} alt="T_SNE_IMG" />
        </Stack>}
    </>
  )
}
