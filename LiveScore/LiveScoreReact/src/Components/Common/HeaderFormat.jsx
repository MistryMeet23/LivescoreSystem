
import React from 'react'
import Typography from '@mui/material/Typography'

const HeaderFormat = ({ title }) => {
    return (
        <div>
            <Typography variant="h6" color="initial">{title}</Typography>
        </div>
    )
}

export default HeaderFormat
