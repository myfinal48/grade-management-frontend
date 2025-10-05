import { cn } from '@/lib/utils'
import { CloudSnow, LucideIcon } from 'lucide-react'
import { FC, ReactNode } from 'react'

export type EmptyContentProps = {
   actionContent?: ReactNode
   text?: string
   icon?: LucideIcon
   withoutIcon?: boolean
   className?: string
}

export const EmptyContent: FC<EmptyContentProps> = ({ actionContent, text, icon: Icon = CloudSnow, withoutIcon = false, className }) => {
   return (
      <div className={cn('flex flex-col items-center gap-6 justify-center h-full py-10 px-5 border rounded-sm', className)}>
         {withoutIcon ? "" : <Icon className={'size-20 text-muted-foreground'} />}
         <div className={'text-lg text-center text-muted-foreground'}>{text ?? 'Pas de contenu disponible !'}</div>
         {actionContent}
      </div>
   )
}
