import AddIcon from '@mui/icons-material/Add'
import HttpsIcon from '@mui/icons-material/Https'
import RemoveIcon from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import BalanceBlock from '../../components/common/BalanceBlock'
import BigNumberInput from '../../components/common/BigNumberInput'
import MaxButton from '../../components/common/MaxButton'
import { UNI } from '../../constants/tokens'
import { MAX_UINT256 } from '../../constants/values'
import { isPos, toBaseUnitBN } from '../../utils/number'
import { approve, depositPool, withdrawPool } from '../../utils/web'
import styles from './Pool.module.scss'

type WithdrawDepositProps = {
    poolAddress: string
    user: string
    balance: BigNumber
    allowance: BigNumber
    stagedBalance: BigNumber
    status: number
}

function WithdrawDeposit({
    poolAddress,
    user,
    balance,
    allowance,
    stagedBalance,
    status,
}: WithdrawDepositProps) {
    const [depositAmount, setDepositAmount] = useState(new BigNumber(0))
    const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0))

    return (
        <Box border={'1px solid black'} className={styles.box_custom_style} >
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                STAGE
            </Box>
            <Box px={2}>
                {allowance && allowance.comparedTo(MAX_UINT256) === 0 ? (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ whiteSpace: 'nowrap' }}>
                            <BalanceBlock
                                asset="Staged"
                                balance={stagedBalance}
                                suffix={'T-3CRV'}
                            />
                        </div>
                        <Box>
                            <div style={{ display: 'flex' }}>
                                {/* Deposit UNI-V2 into Pool */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '60%', minWidth: '6em' }}>
                                        <>
                                            <BigNumberInput
                                                adornment="OD-3CRV"
                                                value={depositAmount}
                                                setter={setDepositAmount}
                                                disabled={status !== 0}
                                            />
                                            <MaxButton
                                                onClick={() => {
                                                    setDepositAmount(balance)
                                                }}
                                            />
                                        </>
                                    </div>
                                    <Button
                                        startIcon={status === 0 ? <AddIcon /> : <HttpsIcon />}
                                        sx={{ height: '40px' }}
                                        onClick={() => {
                                            depositPool(
                                                poolAddress,
                                                toBaseUnitBN(depositAmount, UNI.decimals),
                                                (hash: any) => setDepositAmount(new BigNumber(0))
                                            )
                                        }}
                                        disabled={
                                            poolAddress === '' || status !== 0 || !isPos(depositAmount)
                                        }>
                                        Deposit
                                    </Button>
                                </div>
                                <div style={{ flexBasis: '2%' }} />
                                {/* Withdraw Døllar from DAO */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '60%', minWidth: '6em' }}>
                                        <>
                                            <BigNumberInput
                                                adornment="OD-3CRV"
                                                value={withdrawAmount}
                                                setter={setWithdrawAmount}
                                                disabled={status !== 0}
                                            />
                                            <MaxButton
                                                onClick={() => {
                                                    setWithdrawAmount(stagedBalance)
                                                }}
                                            />
                                        </>
                                    </div>
                                    <Button
                                        startIcon={status === 0 ? <RemoveIcon /> : <HttpsIcon />}
                                        sx={{ height: '40px' }}
                                        onClick={() => {
                                            withdrawPool(
                                                poolAddress,
                                                toBaseUnitBN(withdrawAmount, UNI.decimals),
                                                (hash: any) => setWithdrawAmount(new BigNumber(0))
                                            )
                                        }}
                                        disabled={
                                            poolAddress === '' || status !== 0 || !isPos(withdrawAmount)
                                        }>
                                        Withdraw
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </div>
                ) : (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexBasis: '32%' }}>
                            <BalanceBlock
                                asset="Staged"
                                balance={stagedBalance}
                                suffix={'OD-3CRV'}
                            />
                        </div>
                        <div style={{ flexBasis: '35%' }} />
                        {/* Approve Pool to spend UNI-V2 */}
                        <div className={styles.button_wrapper}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    approve(UNI.addr, poolAddress)
                                }}
                                disabled={poolAddress === '' || user === ''}>
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
                <div style={{ width: '100%', paddingTop: '2%', marginBottom: '5px', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        Get your T-3CRV LP{' '}
                        <a
                            href="https://curve.fi/#/optimism/pools/factory-v2-38/deposit"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>{' '}
                        by supplying T, DAI, USDC, USDT or 3CRV.
                    </span>
                </div>
            </Box>
        </Box>
    )
}

export default WithdrawDeposit
