export function Avatar({ name, size='small' }: { name: string, size: 'small' | 'big' }) {
    return <div className={`relative inline-flex items-center justify-center
     w-${size} h-${size} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 rounded-full ${size === 'small' ? 'w-6 h-6' : 'w-10 h-10'}`}>
    <span className={`${size === 'small' ? 'text-xs' : 'text=md'} text-xs font-extralight text-gray-600 dark:text-gray-300`}>{name[0]}</span>
</div>
}