import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')
if(btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl
        Swal.fire({
            title: 'Esta seguro de eliminarlo?',
            text: "Este proyecto no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/proyectos/${urlProyecto}`
                axios.delete(url, {params: {urlProyecto}}).then( response => {

                    Swal.fire(
                        'Eliminado!',
                        response.data,
                        'success'
                    )

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)

                }).catch(error => {
                     
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: "No se pudo eliminar el proyecto!",
                    })
                    
                })
            }
        })
    })
}

export default btnEliminar