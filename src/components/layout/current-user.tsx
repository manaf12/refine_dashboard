import { Popover,Button } from "antd"
import CustomAvatar from "../custom-avatar"
import type {User} from '@/graphql/schema.types'
import { useGetIdentity } from "@refinedev/core"
import { Text } from "../text"
import { SettingOutlined } from "@ant-design/icons"
import { useState } from "react"
import { AccountSettings } from "./account-settings"

const CurrentUser = ()=>{
  const [isOpen,setIsOpen]=useState(false)
  const {data:user}= useGetIdentity<User>()
   
  const content=(
    <div style={{
      display:'flex',
      flexDirection:'column'
    }}>
        <Text
          strong
          style={{padding:"12px 10px"}}
        >
            {user?.name}
        </Text>
        <div
          style={{
            borderTop:'1px solid #d9d9d9',
              padding:'4px',
              display:'flex',
              flexDirection:"column",
              gap:'4px'
          }}
        >

        <Button
                  icon={<SettingOutlined/>}
                  style={{textAlign:'left'}}
                  type="text"
                  block
                  onClick={()=>setIsOpen(true)}
                  >

            Account Setting
        </Button>
          </div>
    </div>
  )
  return  (
      <>
        <Popover
          placement="bottomRight"
          trigger='click'
    content={content}
        >
          <CustomAvatar
          name={user?.name} 
          src={user?.avatarUrl}
          size='default'
          style={{cursor:"pointer"}}
          />
        </Popover>
        {user && <AccountSettings
            opened={isOpen}
            setOpened={setIsOpen}
            userId={user.id}
        />}
      </>
    )
}
export default CurrentUser