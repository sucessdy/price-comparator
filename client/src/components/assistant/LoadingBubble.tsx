interface LoadingProps { 
    className? : string
}


const LoadingBubble : React.FC<LoadingProps > = ({className = ''}) => {

  return (
    <div className={`bg-gray-100 text-gray-400 p-4 rounded-lg max-w-[80%] `}> ${className}
    <div className="flex items-center space-x-2">  

        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"> 
            
             </div>
    </div>
    
     </div>
  )
}

export default LoadingBubble