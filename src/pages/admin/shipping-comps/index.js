import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
// ************ Services ************
import { useFetchShipping } from '../../../hooks/shipping-comps/useGetShipping'
import { usePostShipping } from '../../../hooks/shipping-comps/usePostShipping'
import { useDeleteShipping } from '../../../hooks/shipping-comps/useDeleteShipping';
import HeaderShippingComps from './header.shipping.comps'
import TableShippingComps from './table.shipping.comps'
import FormShippingComps from './form.shipping.comps'
import AlertComponent from '../../../components/Alert.component';

const ShippingCompsPage = () => {
    const [query, setQuery]= useState()
    const [openModal, setOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [idDelete, setIdDelete] = useState(false)
    const [alert, setAlert] = useState({status:false, message:'', type: ''})
    const {register, handleSubmit, reset:resetFormShipping, formState: { errors }} = useForm({mode:'onSubmit'});
    const {data, isFetching:fetchingShipping, refetch} = useFetchShipping(query)

    const { mutate:deleteShipping } = useDeleteShipping({
        onSuccess: () => {
            refetch()
            setOpenModal(false)
            setIsLoading(false)
            setAlert({message:'Successfully delete data', status:true, type:'success'})
        },
        onError: (status, message)=> {
            console.log(status?.response?.status === 400, "status")
            if (status?.response?.status === 400) {
                setAlert({message: `${status?.response?.data?.message}`, status:true, type:'failure'})
                refetch()
                setOpenModal(false)
                setIsLoading(false)
            } else {
                setAlert({message:`${message}`, status:true, type:'failure'})
            }
        }
    })
    
    const { mutate } = usePostShipping({
        onSuccess: ()=> {
            refetch()
            setIsLoading(false)
            setOpenModal(false)
            setAlert({message:'Successfully saved data', status:true, type:'success'})
        },
        onError: (message)=> {
            setAlert({message:`${message}`, status:true, type:'failure'})
        }
    })

    useEffect(()=>{
        refetch()
    }, [query, refetch])

    const handleOnChange = (event) => {
        setQuery(()=>{
            refetch()
            return event.target.value
        })
    }

    const handleOnSave = (data) => {
        setIsLoading(true)
        mutate(data)
    }

    const handleOnDelete = (id) => {
        setIsLoading(true);
        deleteShipping(id)
    }

    const hanldeOpenModal = async (id) =>{
        if(id){
            const dataUpdate = await data.filter((value)=> value.id===id);
            resetFormShipping(dataUpdate[0])
            setIdDelete(id)
        }else{
            setIdDelete(false)
            resetFormShipping({name:''})
        }
        setOpenModal((state)=> state ? false : true)
    } 

    return (
        <div className='w-full px-8'>
            <AlertComponent alert={alert} setAlert={setAlert} />
            <FormShippingComps 
                openModal={openModal} 
                hanldeOpenModal={hanldeOpenModal} 
                register={register} 
                handleSubmit={handleSubmit} 
                handleOnSave={handleOnSave} 
                errors={errors} 
                isLoading={isLoading}
                handleOnDelete={handleOnDelete}
                idDelete={idDelete}
                title={idDelete ? 'Edit Shipping Comps' : 'Tambah Shipping Comps'}
            />
            <HeaderShippingComps
                query={query} 
                onChange={handleOnChange} 
                hanldeOpenModal={hanldeOpenModal}
            />
            <TableShippingComps 
                data={data} 
                isFetching={fetchingShipping} 
                hanldeOpenModal={hanldeOpenModal} 
            />
        </div>
    )
}

export default ShippingCompsPage