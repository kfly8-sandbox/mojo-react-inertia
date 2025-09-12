import { Head, Link } from '@inertiajs/react'

type Props = {
  status: number
  message: string
}

export default function Error({ status, message }: Props) {
  const getStatusText = (status: number) => {
    switch (status) {
      case 400:
        return 'Bad Request'
      case 404:
        return 'Not Found'
      case 500:
        return 'Internal Server Error'
      default:
        return 'Error'
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <Head title={`Error ${status}`} />
      
      <div style={{ 
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        maxWidth: '500px'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          color: '#dc3545', 
          margin: '0 0 20px 0',
          fontWeight: 'bold'
        }}>
          {status}
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          color: '#495057', 
          margin: '0 0 15px 0' 
        }}>
          {getStatusText(status)}
        </h2>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#6c757d', 
          margin: '0 0 30px 0',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link 
            href="/"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          >
            Go Home
          </Link>
          
          <Link 
            href="/todos"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          >
            View Todos
          </Link>
        </div>
      </div>
    </div>
  )
}